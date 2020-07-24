import { findAllAlphabets } from '../database-actions/alphabet-actions';
import { Contact, AlphabetState } from '../typings/typings';

export class ReadContacts {
  static async invoke() {
    const alphabetStates: AlphabetState[] = await findAllAlphabets({});
    const contactList: Contact[][] = [];
    for (const alphabetState of alphabetStates) {
      const entries: Contact[] = await ReadContacts.getParentState(
        alphabetState
      );
      contactList.push(entries);
    }
    const flattenedContactList: Contact[] = contactList.reduce(
      (a, b) => a.concat(b),
      []
    );
    return flattenedContactList;
  }

  static async getParentState(
    parentAlphabetState: AlphabetState
  ): Promise<Contact[]> {
    const entries: Contact[][] = [];
    const getChildState = (
      alphabetStates: Map<string, AlphabetState>,
      currAlphabet: string
    ) => {
      if (alphabetStates) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, alphabetState] of alphabetStates.entries()) {
          const updatedName = `${currAlphabet}${alphabetState.alphabet}`;
          if (alphabetState.contactInformations.length) {
            entries.push(alphabetState.contactInformations);
          }
          getChildState(alphabetState.alphabetNode, updatedName);
        }
      }
    };

    if (parentAlphabetState.contactInformations.length) {
      entries.push(parentAlphabetState.contactInformations);
    }
    getChildState(
      parentAlphabetState.alphabetNode,
      parentAlphabetState.alphabet
    );

    const flattenedEntries: Contact[] = entries.reduce(
      (a, b) => a.concat(b),
      []
    );
    return flattenedEntries;
  }
}
