"use strict";
class Contact {
    constructor(name, phone, email) {
        this.id = Date.now();
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}
class ContactManager {
    constructor() {
        this.contacts = [];
        this.formContainer = document.querySelector(".form-container");
        this.form = document.querySelector(".form");
        this.loadFromStorage();
        this.displayContacts();
        this.setupEventListeners();
    }
    addContact(contact) {
        this.contacts.push(contact);
        this.saveToStorage();
        this.displayContacts();
    }
    updateContact(id, updatedData) {
        const index = this.contacts.findIndex(c => c.id === id);
        if (index > -1) {
            this.contacts[index] = Object.assign({}, updatedData);
            this.saveToStorage();
            this.displayContacts();
        }
    }
    deleteContact(id) {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.saveToStorage();
        this.displayContacts();
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
    displayContacts() {
        const list = document.querySelector(".contact-list");
        if (!list)
            return;
        list.innerHTML = "";
        if (this.contacts.length === 0) {
            list.innerHTML = "<p>No contacts found. Add your first contact!</p>";
            return;
        }
        this.contacts.forEach(contact => {
            const div = document.createElement("div");
            div.className = "contact-card";
            div.innerHTML = `
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Phone:</strong> ${contact.phone}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <button data-action="edit" data-id="${contact.id}">Edit</button>
                <button data-action="delete" data-id="${contact.id}">Delete</button>
            `;
            list.appendChild(div);
        });
    }
    setupEventListeners() {
        const toggleBtn = document.getElementById("btn");
        // Toggle form visibility
        toggleBtn.addEventListener("click", () => {
            this.formContainer.classList.toggle("hidden");
            if (!this.formContainer.classList.contains("hidden")) {
                this.form.reset();
                this.form.removeAttribute("data-editing");
            }
        });
        // Form submission
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("username").value;
            const phone = document.getElementById("phone_number").value;
            const email = document.getElementById("email").value;
            const editId = this.form.getAttribute("data-editing");
            if (editId) {
                this.updateContact(Number(editId), {
                    id: Number(editId),
                    name,
                    phone,
                    email
                });
                this.form.removeAttribute("data-editing");
            }
            else {
                const newContact = new Contact(name, phone, email);
                this.addContact(newContact);
            }
            this.form.reset();
            this.formContainer.classList.add("hidden");
        });
        // Event delegation for edit and delete buttons
        const list = document.querySelector(".contact-list");
        if (list) {
            list.addEventListener('click', (e) => {
                const target = e.target;
                // Handle edit
                if (target.matches('button[data-action="edit"]') || target.closest('button[data-action="edit"]')) {
                    const button = target.matches('button[data-action="edit"]') ?
                        target :
                        target.closest('button[data-action="edit"]');
                    if (button) {
                        const id = parseInt(button.dataset.id || '0');
                        this.handleEditContact(id);
                    }
                }
                // Handle delete
                if (target.matches('button[data-action="delete"]') || target.closest('button[data-action="delete"]')) {
                    const button = target.matches('button[data-action="delete"]') ?
                        target :
                        target.closest('button[data-action="delete"]');
                    if (button) {
                        const id = parseInt(button.dataset.id || '0');
                        this.handleDeleteContact(id);
                    }
                }
            });
        }
    }
    handleEditContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            document.getElementById("username").value = contact.name;
            document.getElementById("phone_number").value = contact.phone;
            document.getElementById("email").value = contact.email;
            this.form.setAttribute("data-editing", contact.id.toString());
            this.formContainer.classList.remove("hidden");
        }
    }
    handleDeleteContact(id) {
        if (confirm("Are you sure you want to delete this contact?")) {
            this.deleteContact(id);
        }
    }
}
const manager = new ContactManager();
