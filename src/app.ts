interface ContactData {
    id: number;
    name: string;
    phone: string;
    email: string;
}

class Contact implements ContactData {
    id: number;
    name: string;
    phone: string;
    email: string;

    constructor(name: string, phone: string, email: string) {
        this.id = Date.now();
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}

class ContactManager {
    contacts: Contact[] = [];

    constructor() {
        this.loadFromStorage();
        this.renderContacts();
    }

    addContact(contact: Contact) {
        this.contacts.push(contact);
        this.saveToStorage();
        this.renderContacts();
    }

    updateContact(id: number, updatedData: ContactData) {
        const index = this.contacts.findIndex(c => c.id === id);
        if (index > -1) {
            this.contacts[index] = { ...updatedData };
            this.saveToStorage();
            this.renderContacts();
        }
    }

    deleteContact(id: number) {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.saveToStorage();
        this.renderContacts();
    }

    saveToStorage() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    loadFromStorage() {
        const stored = localStorage.getItem("contacts");
        if (stored) {
            this.contacts = JSON.parse(stored);
        }
    }

    renderContacts() {
        const list = document.querySelector(".contact-list") as HTMLElement;
        if (!list) return;

        list.innerHTML = "";

        this.contacts.forEach(contact => {
            const div = document.createElement("div");
            div.className = "contact-card";
            div.innerHTML = `
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Phone:</strong> ${contact.phone}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <button onclick="editContact(${contact.id})">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            `;
            list.appendChild(div);
        });
    }
}


const manager = new ContactManager();


const form = document.querySelector(".form") as HTMLFormElement;
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("username") as HTMLInputElement;
    const phoneInput = document.getElementById("phone_number") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;

    const name = nameInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;

    const editId = (form.getAttribute("data-editing") || "");

    if (editId) {
        manager.updateContact(Number(editId), {
            id: Number(editId),
            name,
            phone,
            email
        });
        form.removeAttribute("data-editing");
    } else {
        const newContact = new Contact(name, phone, email);
        manager.addContact(newContact);
    }

    form.reset();
});

const toggleBtn = document.getElementById("btn") as HTMLButtonElement;
const formContainer = document.querySelector(".form-container") as HTMLElement;

toggleBtn.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
});


(window as any).editContact = (id: number) => {
    const contact = manager.contacts.find(c => c.id === id);
    if (contact) {
        (document.getElementById("username") as HTMLInputElement).value = contact.name;
        (document.getElementById("phone_number") as HTMLInputElement).value = contact.phone;
        (document.getElementById("email") as HTMLInputElement).value = contact.email;
        form.setAttribute("data-editing", contact.id.toString());
        formContainer.classList.remove("hidden");
    }
};

(window as any).deleteContact = (id: number) => {
    if (confirm("Are you sure you want to delete this contact?")) {
        manager.deleteContact(id);
    }
};
