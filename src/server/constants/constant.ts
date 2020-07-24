import { v4 as uuidv4 } from 'uuid';
import { AlphabetState, Contact } from '../typings/typings';

export const newAlphabetState = (alphabet: string): AlphabetState => {
  return {
    alphabet,
    contactInformations: [],
    alphabetNode: new Map(),
  };
};

export const newContactState = (contactInformation: Contact): Contact => {
  return {
    uuid: uuidv4(),
    contactName: contactInformation.contactName,
    contactNumbers: contactInformation.contactNumbers,
    emailAddress: contactInformation.emailAddress,
    address: contactInformation.address,
    communicator: contactInformation.communicator,
    specialDates: contactInformation.specialDates,
    relationship: contactInformation.relationship,
    notes: contactInformation.notes,
  };
};

export const updateContactState = (
  uuid: string,
  contactInformation: Contact
): Contact => {
  return {
    uuid,
    contactName: contactInformation.contactName,
    contactNumbers: contactInformation.contactNumbers,
    emailAddress: contactInformation.emailAddress,
    address: contactInformation.address,
    communicator: contactInformation.communicator,
    specialDates: contactInformation.specialDates,
    relationship: contactInformation.relationship,
    notes: contactInformation.notes,
  };
};

export const supportedKeys = [
  'contactName',
  'contactNumbers',
  'emailAddress',
  'address',
  'communicator',
  'specialDates',
  'relationship',
  'notes',
];
