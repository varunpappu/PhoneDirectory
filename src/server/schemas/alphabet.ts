import mongoose from 'mongoose';

const AlphabetSchema = new mongoose.Schema();
AlphabetSchema.add({
  alphabet: {
    type: String,
  },
  contactInformations: [],
  alphabetNode: {
    type: Map,
    of: AlphabetSchema,
  },
});

const AlphabetModel = mongoose.model('AlphabetSchema', AlphabetSchema);
export default AlphabetModel;
