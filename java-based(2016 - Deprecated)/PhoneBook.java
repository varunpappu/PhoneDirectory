import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class PhoneBook {

	private static String DATA_FILE_NAME = "phonedirectory.txt";

	public static void main(String[] args) {
		Scanner input = new Scanner(System.in);
		TreeMap<String, String> directory = new TreeMap<String, String>();
		ContactPerson cp = new ContactPerson();

		String name, phonenumber;
		File userHomeDirectory = new File(System.getProperty("user.home"));
		File dataFile = new File(userHomeDirectory, DATA_FILE_NAME);

		if (!dataFile.exists()) {
			System.out.println("No phone book data file found.");
			System.out.println("A new one will be created.");
			System.out.println("File name:  " + dataFile.getAbsolutePath());
		} else {
			System.out.println("Reading phone book data...");
			try {
				Scanner scanner = new Scanner(dataFile);
				while (scanner.hasNextLine()) {
					String phoneEntry = scanner.nextLine();
					int separatorPosition = phoneEntry.indexOf('%');
					if (separatorPosition == -1)
						throw new IOException("File is not a phonebook data file.");
					name = phoneEntry.substring(0, separatorPosition);
					phonenumber = phoneEntry.substring(separatorPosition + 1);
					directory.put(name, phonenumber);
				}
			} catch (IOException e) {
				System.out.println("Error in phone book data file.");
				System.out.println("File name:  " + dataFile.getAbsolutePath());
				System.out.println("This program cannot continue.");
				System.exit(1);
			}
		}

		System.out.println("Welcome to the Phone Directory");
		boolean looping = true;
		boolean changed = false;
		while (looping) {
			System.out.println("Choose an option");
			System.out.println("1) Add name and phonenumber to directory");
			System.out.println("2) List entire phone directory");
			System.out.println("3) Do you want to perform an update");
			System.out.println("4) Phone number lookup");
			System.out.println("5) Remove an entry");
			System.out.println("6) Exit from the program");
			System.out.println("Enter action number (1-6):  ");
			int option;
			if (input.hasNextInt()) {
				option = input.nextInt();
				input.nextLine();
			} else {
				System.out.println("\nILLEGAL RESPONSE.  YOU MUST ENTER A NUMBER.");
				input.nextLine();
				continue;
			}

			if (option == 1) {
				addContact(directory, cp); // done
				changed = true;
			} else if (option == 2) {
				listAllContacts(directory); // done
			} else if (option == 3) {
				updateContactNumber(directory, cp); // done
				changed = true;
			} else if (option == 4) {
				contactLookup(directory, cp); // done
			} else if (option == 5) {
				contactRemove(directory, cp);
				changed = true;
			} else if (option == 6) {
				System.out.println("Exiting the directory");
				changed = true;
				looping = false;
			} else {
				System.out.println("\nILLEGAL ACTION NUMBER.");
			}

		}
		if (changed) {
			System.out.println("Saving phone directory changes to file " + dataFile.getAbsolutePath() + " ...");
			PrintWriter out;
			try {
				out = new PrintWriter(new FileWriter(dataFile), true);
			} catch (IOException e) {
				System.out.println("ERROR: Can't open data file for output.");
				return;
			}
			for (Map.Entry<String, String> entry : directory.entrySet())
				out.println("Name: " + entry.getKey() + "% Phonenumber: " + entry.getValue());
			out.close();
			if (out.checkError())
				System.out.println("ERROR: Some error occurred while writing data file.");
			else
				System.out.println("Done.");
		}

	}

	private static void contactRemove(TreeMap<String, String> directory, ContactPerson cp) {
		Scanner input = new Scanner(System.in);
		String choice;
		do {
			System.out.println("Enter the name to deleted from the dierctory");
			cp.setName(input.next());
			if (directory.containsKey(cp.getName())) {
				System.out
						.println("Current name and phone number :" + cp.getName() + " " + directory.get(cp.getName()));
				System.out.println("Are you sure you want to delete: (Y/N)");
				choice = input.next();
				if (choice.equalsIgnoreCase("Y") || choice.equalsIgnoreCase("YES")) {
					directory.remove(cp.getName());
					System.out.println("Entry removed from the directory");
					break;
				}
			} else {
				System.out.println("Name not found");
				System.out.println("Do you want to try a different name? (Y/N) ");
				choice = input.next();
			}
		} while (choice.equalsIgnoreCase("Y") || choice.equalsIgnoreCase("YES"));

	}

	private static void contactLookup(TreeMap<String, String> directory, ContactPerson cp) {
		Scanner in = new Scanner(System.in);
		System.out.println("Enter the name to find the corresponding phone number:");
		cp.setName(in.next());
		System.out.println("The phone number for " + cp.getName() + " is: " + directory.get(cp.getName()));
	}

	private static void updateContactNumber(TreeMap<String, String> directory, ContactPerson cp) {
		Scanner input = new Scanner(System.in);
		String option;

		do {
			System.out.println("Enter the name to update the phone number");
			cp.setName(input.next());
			if (directory.containsKey(cp.getName())) {
				System.out
						.println("Current name and phone number :" + cp.getName() + " " + directory.get(cp.getName()));
				System.out.println("Do you want to change the phone number: (Y/N)");
				option = input.next();
				if (option.equalsIgnoreCase("Y") || option.equalsIgnoreCase("YES")) {
					numberChange(directory, cp);
					break;
				}
			} else {
				System.out.println("Name not found");
				System.out.println("Do you want to try a different name? (Y/N) ");
				option = input.next();
			}
		} while (option.equalsIgnoreCase("Y") || option.equalsIgnoreCase("YES"));
	}

	private static void numberChange(TreeMap<String, String> directory, ContactPerson cp) {
		validNumber(cp);
		directory.put(cp.getName(), cp.getPhoneNumber());
		System.out.println(
				"Number updated, new name and phone number: " + cp.getName() + " " + directory.get(cp.getName()));

	}

	private static void listAllContacts(TreeMap<String, String> directory) {
		System.out.println("Listing the entire phone directory");
		for (Map.Entry<String, String> entry : directory.entrySet()) {
			System.out.println("Name: " + entry.getKey() + " Phone number: " + entry.getValue());
		}

	}

	private static void addContact(TreeMap<String, String> directory, ContactPerson cp) {
		Scanner input = new Scanner(System.in);
		String choice;
		System.out.println("Enter the name:");
		cp.setName(input.next());

		if (directory.containsKey(cp.getName())) {
			System.out.println("The name " + cp.getName() + " already exists with following phone number :"
					+ directory.get(cp.getName()));

			System.out.println("Do you want to change or update?");

			choice = input.next();

			if (choice.equalsIgnoreCase("change")) {
				addContact(directory, cp);
			} else if (choice.equalsIgnoreCase("update")) {
				validNumber(cp);
				directory.put(cp.getName(), cp.getPhoneNumber());
			}

		} else {
			validNumber(cp);
			directory.put(cp.getName(), cp.getPhoneNumber());
		}
	}

	private static String validNumber(ContactPerson cp) {
		Scanner input = new Scanner(System.in);
		int val = 0;

		do {
			System.out.println("Enter a valid phone number:");
			cp.setPhoneNumber(input.next());
			try {
				val = Integer.valueOf(cp.getPhoneNumber());
			} catch (NumberFormatException e) {
				System.out.println("Invalid phone number");
			}

		} while (val <= 0 || cp.getPhoneNumber().length() != 2);
		return cp.getPhoneNumber();
	}
}
