import { findAlphabet } from '../database-actions/alphabet-actions';
import { AlphabetState, Contact } from '../typings/typings';
import { updateContactState } from '../constants/constant';
import { SaveContact } from './save-contact';

export class UpdateContact {
  static async invoke(requestParams, requestBody) {
    const contactName: string = requestParams.contactName;
    const contactId = requestParams.contactId;
    const firstAlphabet: string = contactName.slice(0, 1);
    const alphabetState = await findAlphabet({
      alphabet: firstAlphabet,
    });

    if (alphabetState) {
      await UpdateContact.getParentNode(
        alphabetState,
        contactName,
        contactId,
        requestBody
      );

      await alphabetState.update(alphabetState);
    }
  }

  static async getParentNode(
    alphabetState: AlphabetState,
    contactName: string,
    contactId: string,
    updatedData
  ) {
    const findChildNodes = async (
      currAlphabetState: Map<string, AlphabetState>,
      currAlphabet: string
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, alphState] of currAlphabetState.entries()) {
        const updatedName = `${currAlphabet}${alphState.alphabet}`;
        if (updatedName === contactName) {
          const updatedContactInfo = await UpdateContact.findAndUpdateContactInfo(
            alphState.contactInformations,
            contactId,
            updatedData
          );
          if (
            updatedContactInfo.updatedContactList.length !==
            alphState.contactInformations.length
          ) {
            await SaveContact.invoke(updatedContactInfo.existingContact, true);
          }
          alphState.contactInformations = updatedContactInfo.updatedContactList;
        }
        await findChildNodes(alphState.alphabetNode, updatedName);
      }
    };

    if (alphabetState.alphabet === contactName) {
      const updatedContactInfo = await UpdateContact.findAndUpdateContactInfo(
        alphabetState.contactInformations,
        contactId,
        updatedData
      );
      if (
        updatedContactInfo.updatedContactList.length !==
        alphabetState.contactInformations.length
      ) {
        await SaveContact.invoke(updatedContactInfo.existingContact, true);
      }
      alphabetState.contactInformations = updatedContactInfo.updatedContactList;
    } else {
      await findChildNodes(alphabetState.alphabetNode, alphabetState.alphabet);
    }
  }

  static async findAndUpdateContactInfo(
    contactInformations,
    contactId,
    updatedData
  ) {
    const updatedContactList: Contact[] = [];
    let existingContact: Contact | {} = {};
    contactInformations.forEach((contactInformation: Contact) => {
      if (
        contactInformation.uuid === contactId &&
        contactInformation.contactName.displayName ===
          updatedData.contactName.displayName
      ) {
        updatedContactList.push(
          updateContactState(contactInformation.uuid, updatedData)
        );
      } else if (
        contactInformation.uuid === contactId &&
        contactInformation.contactName.displayName !==
          updatedData.contactName.displayName
      ) {
        existingContact = updateContactState(
          contactInformation.uuid,
          updatedData
        );
      } else {
        updatedContactList.push(contactInformation);
      }
    });
    return { updatedContactList, existingContact };
  }
}
