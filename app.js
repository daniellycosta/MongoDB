const MongoClient = require("mongodb").MongoClient
const inquirer = require("inquirer")

const url = "mongodb://localhost:27017/contacts"
const client = new MongoClient(url)
client.connect()
const db = client.db("contacts");

async function listContactLists(){
    const contactsLists = await db.listCollections().toArray()

    const formattedCollections = contactsLists.map(collections => ({name: collections.name}))
    console.table(formattedCollections)
    menu()
}

async function createContactList(){
    inquirer.prompt([
        {
            type:"input",
            name:"collectionName",
            message:"Insert the List's name",
        }
    ]).then(answer=>{
        db.createCollection(answer.collectionName)
        console.log(`${answer.collectionName} created successfully!`)
    }).catch(error => {
        console.log(error);
    }).finally(()=>{
        menu()
    });
}

async function removeContactList(){
   inquirer.prompt([
        {
            type:"input",
            name:"collectionName",
            message:"Insert the List's name",
        }
    ]).then(answer=>{
        db.dropCollection(answer.collectionName)
        console.log(`${answer.collectionName} deleted successfully!`)      
    }).catch(error => {
        console.log(error);
    }).finally(()=>{
        menu()
    });

    
}

function menu() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'action',
                message: 'Action',
                choices: ['List Contact Lists', 'Create Contact List', 'Remove Contact List'],
            },
        ])
        .then(function (answers) {
            switch (answers['action']) {
                case "List Contact Lists":
                     listContactLists();
                    break;
                case "Create Contact List":
                     createContactList();
                    break;
                case "Remove Contact List":
                     removeContactList();
                    break;
                default:
                    menu();
            }
        })
        .catch(error => {
            console.log(error);
        });
};

menu();
