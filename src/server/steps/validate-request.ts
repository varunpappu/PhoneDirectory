import { ContactName } from '../typings/typings';
import { supportedKeys } from '../constants/constant';
import moment from 'moment';

const isEmpty = inputObject => {
  return Object.keys(inputObject).length === 0;
};

export class ValdiateRequest {
  private validationIsses: ValidationIssues[];
  constructor() {
    this.validationIsses = [];
  }
  invoke(data) {
    this.checkSupportedKeys(data);

    if (this.validationIsses.length === 0) {
      if (data.hasOwnProperty('contactName')) {
        this.validateName(data.contactName);
      }
      if (data.hasOwnProperty('contactNumbers')) {
        this.validateNumbers(data.contactNumbers);
      }

      if (data.hasOwnProperty('emailAddress')) {
        this.validateEmailAddress(data.emailAddress);
      }

      if (data.hasOwnProperty('specialDates')) {
        this.validateSpecialDates(data.specialDates);
      }
    }

    return this.validationIsses;
  }

  validateName = (value: ContactName) => {
    const contactName: Issues = {};
    if (value.displayName === '' || value.displayName === null) {
      contactName.displayName = 'This field is required';
    }

    if (!isEmpty(contactName)) this.validationIsses.push({ contactName });
  };

  validateNumbers = (contactTypes: ValueTypes) => {
    const contactNumbers: Issues = {};
    for (const [key, value] of Object.entries(contactTypes)) {
      if (isNaN(value as number)) {
        contactNumbers[key] = 'The following must be a number';
      }
    }
    if (!isEmpty(contactNumbers)) this.validationIsses.push({ contactNumbers });
  };

  validateEmailAddress = (emailAddresses: ValueTypes) => {
    const emailAddress: Issues = {};
    for (const [key, value] of Object.entries(emailAddresses)) {
      if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value as string)
      ) {
        emailAddress[key] = 'The field must be a valid Email address';
      }
    }

    if (!isEmpty(emailAddress)) this.validationIsses.push({ emailAddress });
  };

  validateSpecialDates = (specialDateValues: ValueTypes) => {
    const specialDates: Issues = {};
    for (const [key, value] of Object.entries(specialDateValues)) {
      const newDate = moment(value as string, 'DD/MM/YYYY', true);
      if (!newDate.isValid()) {
        specialDates[key] = 'The date is invalid';
      }
    }
    if (!isEmpty(specialDates)) this.validationIsses.push({ specialDates });
  };

  checkSupportedKeys = data => {
    const keyErrors: Issues = {};
    const keys: string[] = Object.keys(data);
    keys.forEach(key => {
      const isExist = supportedKeys.includes(key);
      if (!isExist) {
        keyErrors[key] = 'The key is invalid';
      }
    });
    if (!isEmpty(keyErrors)) this.validationIsses.push({ keyErrors });
  };
}

interface Issues {
  [key: string]: string;
}

interface ValidationIssues {
  [key: string]: Issues;
}

interface ValueTypes {
  [key: string]: string | number;
}
