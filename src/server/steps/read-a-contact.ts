import { findAlphabet } from '../database-actions/alphabet-actions';
import { AlphabetState, Contact } from '../typings/typings';

export class ReadContact {
  static async invoke(searchParam: string) {
    const firstAlphabet: string = searchParam.slice(0, 1);
    const alphabetState: AlphabetState = await findAlphabet({
      alphabet: firstAlphabet,
    });

    return ReadContact.getParentState(alphabetState, searchParam);
  }

  static async getParentState(alphabetState, searchParam) {
    let contactList: Contact[] = [];
    if (!alphabetState) {
      return contactList;
    }

    const getChildStates = async (
      currAlphabetState: Map<string, AlphabetState>,
      currAlphabet: string
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, alphState] of currAlphabetState.entries()) {
        const updatedName = `${currAlphabet}${alphState.alphabet}`;
        if (updatedName === searchParam) {
          contactList = alphState.contactInformations;
        }
        await getChildStates(alphState.alphabetNode, updatedName);
      }
    };
    if (alphabetState.alphabet === searchParam) {
      contactList = alphabetState.contactInformations;
    } else {
      await getChildStates(alphabetState.alphabetNode, alphabetState.alphabet);
    }
    return contactList;
  }
}
