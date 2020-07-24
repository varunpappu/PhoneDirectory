import { Request, Response } from 'express';
import { SaveContact } from '../steps/save-contact';
import { ReadContacts } from '../steps/read-all-contacts';
import { ReadContact } from '../steps/read-a-contact';

import { UpdateContact } from '../steps/update-a-contact';
import { DeleteContact } from '../steps/delete-a-contacts';
import { TrieNodes } from '../steps/read-trie-nodes';
import { ValdiateRequest } from '../steps/validate-request';

exports.addContact = async (req: Request, res: Response) => {
  try {
    const validationIssues = new ValdiateRequest().invoke(req.body);

    if (validationIssues.length) {
      res.status(400).json({
        status: 'BAD_REQUEST',
        message: validationIssues,
        success: false,
      });
    } else {
      await SaveContact.invoke(req.body, false);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Successfully Created',
        success: true,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};

exports.getAllContacts = async (req: Request, res: Response) => {
  try {
    const contactList = await ReadContacts.invoke();
    res.status(200).json({
      status: 'SUCCESS',
      data: contactList,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};

exports.getTriesNodes = async (req: Request, res: Response) => {
  try {
    const trieNodes = await TrieNodes.invoke();
    res.status(200).json({
      status: 'SUCCESS',
      data: trieNodes,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};

exports.getAContact = async (req: Request, res: Response) => {
  try {
    const contactList = await ReadContact.invoke(req.params.contactName);
    res.status(200).json({
      status: 'SUCCESS',
      data: contactList,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};

exports.updateAContact = async (req: Request, res: Response) => {
  try {
    const validationIssues = new ValdiateRequest().invoke(req.body);
    if (validationIssues.length) {
      res.status(400).json({
        status: 'BAD_REQUEST',
        message: validationIssues,
        success: false,
      });
    } else {
      await UpdateContact.invoke(req.params, req.body);
      res.status(200).json({
        status: 'SUCCESS',
        data: 'Successfully Updated',
        success: true,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};

exports.deleteAContact = async (req: Request, res: Response) => {
  try {
    await DeleteContact.invoke(req.params);
    res.status(200).json({
      status: 'SUCCESS',
      data: 'Successfully deleted',
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      status: 'BAD_REQUEST',
      message: err,
      success: false,
    });
  }
};
