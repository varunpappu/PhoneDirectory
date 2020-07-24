import AlphabetModel from '../schemas/alphabet';

export const createAlphabet = alphabetState => {
  const alphabetModel = new AlphabetModel(alphabetState).save();
  return alphabetModel;
};

export const findAlphabet = key => {
  const alphabetState = AlphabetModel.findOne(key);
  return alphabetState;
};

export const findAllAlphabets = key => {
  const alphabetState = AlphabetModel.find(key);
  return alphabetState;
};
