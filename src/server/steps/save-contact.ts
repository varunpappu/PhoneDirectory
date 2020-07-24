import {
  findAlphabet,
  createAlphabet,
} from '../database-actions/alphabet-actions';
import {
  newAlphabetState,
  newContactState,
  updateContactState,
} from '../constants/constant';
import { AlphabetState, Contact } from '../typings/typings';

export class SaveContact {
  static async invoke(requestBody, isUpdate) {
    const alphabets: string[] = requestBody.contactName.displayName.split('');
    const rootAlphabet = alphabets[0];
    let rootAlphabetState: AlphabetState = newAlphabetState(rootAlphabet);

    const alphabetStateExist: AlphabetState | null = await findAlphabet({
      alphabet: rootAlphabet,
    });

    if (alphabetStateExist) {
      rootAlphabetState = alphabetStateExist;
    }

    let newContact = newContactState(requestBody);
    if (isUpdate) {
      newContact = updateContactState(requestBody.uuid, requestBody);
    }
    alphabets.shift();
    const updatedAlphabetState: AlphabetState = SaveContact.traverseChildNodes(
      alphabets,
      rootAlphabetState,
      newContact
    );
    await createAlphabet(updatedAlphabetState);
  }

  static traverseChildNodes(
    childAlphabets: string[],
    currentAlphabetNode: AlphabetState,
    newContact: Contact
  ): AlphabetState {
    if (childAlphabets.length === 0) {
      currentAlphabetNode.contactInformations.push(newContact);
      return currentAlphabetNode;
    }

    const currentAlphabet: string = childAlphabets[0];
    let rootAlphabetState: AlphabetState = newAlphabetState(currentAlphabet);

    const alphabetStateExist:
      | AlphabetState
      | undefined = currentAlphabetNode.alphabetNode.get(currentAlphabet);
    if (alphabetStateExist) {
      rootAlphabetState = alphabetStateExist;
    }

    childAlphabets.shift();
    const childAlphabetNodes: AlphabetState = SaveContact.traverseChildNodes(
      childAlphabets,
      rootAlphabetState,
      newContact
    );

    currentAlphabetNode.alphabetNode.set(currentAlphabet, childAlphabetNodes);
    return currentAlphabetNode;
  }
}
