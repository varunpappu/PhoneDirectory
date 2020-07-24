export interface Contact {
  uuid: string;
  contactName: ContactName;
  contactNumbers: {};
  emailAddress: {};
  address: {};
  communicator: {};
  specialDates: {};
  relationship: string;
  notes: string;
}

export interface AlphabetState {
  alphabet: string;
  contactInformations: Contact[];
  alphabetNode: Map<string, AlphabetState>;
}

interface ContactName {
  displayName: string;
  nickname: string;
}
