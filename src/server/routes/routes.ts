export class Routes {
  public static routes(app): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const controller = require('../controllers/controller');

    app.post('/public/v1/contact/create', controller.addContact);

    app.get('/public/v1/contacts', controller.getAllContacts);

    app.get('/public/v1/trie-nodes/contacts', controller.getTriesNodes);

    app.get('/public/v1/contacts/:contactName', controller.getAContact);

    app.put(
      '/public/v1/contacts/:contactName/:contactId',
      controller.updateAContact
    );

    app.delete(
      '/public/v1/contacts/:contactName/:contactId',
      controller.deleteAContact
    );
  }
}
