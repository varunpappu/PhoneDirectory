import { AlphabetState } from '../typings/typings';
import { findAllAlphabets } from '../database-actions/alphabet-actions';

export class TrieNodes {
  static async invoke() {
    const contactList: any = [];
    const alphabetStates: AlphabetState[] = await findAllAlphabets({});
    for (const alphabetState of alphabetStates) {
      const node = await TrieNodes.getParentState(alphabetState);
      contactList.push(node);
    }
    return contactList;
  }

  static async getParentState(parentAlphabetState: AlphabetState) {
    const getChildState = (alphabetStates: Map<string, AlphabetState>) => {
      if (alphabetStates) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, alphabetState] of alphabetStates.entries()) {
          const childNode = {
            alphabet: alphabetState.alphabet,
            contacts: alphabetState.contactInformations,
            alphabetNode: getChildState(alphabetState.alphabetNode),
          };
          return childNode;
        }
      }
    };

    const rootNode = {
      alphabet: parentAlphabetState.alphabet,
      contacts: parentAlphabetState.contactInformations,
      alphabetNode: getChildState(parentAlphabetState.alphabetNode),
    };
    return rootNode;
  }
}
