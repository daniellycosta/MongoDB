const inquirer = require('inquirer')
const MongoClient = require('mongodb').MongoClient
const ObjectId =  require('mongodb').ObjectId

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
client.connect()
const db = client.db("contacts");

// Criar contactos com dados de empresa

async function listContacts(contactList) {
    const contacts = await db.collection(contactList).find().toArray()

    const formattedContacts = contacts.map(({ _id, name, number,company }) => {     
        return {
        id: _id.toString(),
        name,
        number,
        "company name": company? company.name : "-",
        "company address": company? company.address : "-",
        "job position": company? company.position : "-"
    }})

    console.table(formattedContacts)
    options()
}

async function createContact(contactList) {
    try {
        const { name, number, insertCompanyData} = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Insert the contact's name",
            },
            {
                type: "input",
                name: "number",
                message: "Insert the contact's phone number",
            },
            {
                type:"confirm",
                name:"insertCompanyData",
                message: "Wish to insert company data?",
                default:false
            }
        ])
         
        const contact = {name, number}

        if(insertCompanyData){
            const {name, address, position} = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Insert the company name",
                },
                {
                    type: "input",
                    name: "address",
                    message: "Insert the company address",
                },
                {
                    type: "input",
                    name: "position",
                    message: "Insert the job position",
                },
            ])

             const company = {name, address, position}
             contact.company = company   
        }
        await await db.collection(contactList).insertOne(contact)
        console.log(`contact ${name} created successfully!`)

    } catch (error) {
        console.log(error);
    } finally {
        options()
    }
}

async function removeContacts(contactList) {
    try {
        const { id } = await inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Insert the contact id",
            }
        ])
        await db.collection(contactList).deleteOne({ _id: new ObjectId(id) })
        console.log(`${id} deleted successfully!`)
    } catch {
        console.log(error);
    } finally {
        options()
    }
}

function options() {

    const questions = [
        {
            type: "input",
            name: "contactList",
            message: "Type a contact list"
        },
        {
            type: "rawlist",
            name: "action",
            message: "Choose an action",
            choices: ["List Contacts", "Create Contact", "Remove Contact", "Exit"]
        }
    ]

    inquirer.prompt(questions).then(function (answers) {
        const contactList = answers.contactList
        const action = answers.action

        switch (action) {
            case "List Contacts":
                listContacts(contactList)
                break;
            case "Create Contact":
                createContact(contactList)
                break;
            case "Remove Contact":
                removeContacts(contactList)
                break;
            case "Exit":
                process.exit()
            default:
                options()
        }
    })
}

options()