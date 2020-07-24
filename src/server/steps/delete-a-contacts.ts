import { findAlphabet } from '../database-actions/alphabet-actions';
import { AlphabetState, Contact } from '../typings/typings';

export class DeleteContact {
  static async invoke(requestParam) {
    const contactName = requestParam.contactName;
    const contactId = requestParam.contactId;
    const firstAlphabet = contactName.slice(0, 1);
    const alphabetState = await findAlphabet({
      alphabet: firstAlphabet,
    });

    if (alphabetState) {
      await DeleteContact.getParentState(alphabetState, contactName, contactId);
      await alphabetState.update(alphabetState);
    }
  }

  static async getParentState(
    alphabetState: AlphabetState,
    contactName: string,
    contactId: string
  ) {
    const findChildNodes = async (
      currAlphabetState: Map<string, AlphabetState>,
      currAlphabet: string
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, alphState] of currAlphabetState.entries()) {
        const updatedName = `${currAlphabet}${alphState.alphabet}`;
        if (updatedName === contactName) {
          const updatedContactInfo = await DeleteContact.deleteContactInfo(
            alphState.contactInformations,
            contactId
          );
          alphState.contactInformations = updatedContactInfo;
        }
        await findChildNodes(alphState.alphabetNode, updatedName);
      }
    };

    if (alphabetState.alphabet === contactName) {
      const updatedContactInfo = await DeleteContact.deleteContactInfo(
        alphabetState.contactInformations,
        contactId
      );
      alphabetState.contactInformations = updatedContactInfo;
    } else {
      await findChildNodes(alphabetState.alphabetNode, alphabetState.alphabet);
    }
  }

  static async deleteContactInfo(
    contactInformations: Contact[],
    contactId: string
  ) {
    return contactInformations.filter(
      (contactInformation: Contact) => contactInformation.uuid !== contactId
    );
  }
}
