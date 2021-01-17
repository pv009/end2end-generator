# change password, lost password
email_form_values = {
    "controls": ["email"],
    "values": ["paul.voges@edecy.de"],
    "name": "emailForm"
}

# login
login_form_values = {
    "controls": ["email", "password"],
    "values": ["paul.voges@edecy.de", "12345678"],
    "name": "loginForm"
}

# user data
user_data_form_values = {
    "controls": ["email", "title", "gender", "firstName", "lastName", "organisation", "orgStreetNo", "orgPlz", "orgCity", "telephone", "phoneAvailable"],
    "values": ["paul.voges@edecy.de", "Prof.", "Herr", "Paul", "Voges", "Edecy UG", "Wendenstraße 130", "20537", "Hamburg", "12345678", "gegen 10"],
    "name": "userDataForm"
}

# Search form
search_for_values = {
    "controls": ["keyword"],
    "values": ["Maschinenbau"],
    "name": "searchForm"
}

card_details = [
    {
        "element_type": "div",
        "element_class": "card-image"
    },
    {
        "element_type": "h2",
        "element_class": "cardTitle"
    },
    {
        "element_type": "div",
        "element_class": "icon-container"
    },
    {
        "element_type": "div",
        "element_class": "tags"
    },
    {
        "element_type": "div",
        "element_class": "descriptions"
    },
    {
        "element_type": "div",
        "element_class": "partner-infos"
    },
    {
        "element_type": "div",
        "element_class": "specialties"
    },
]

profile_details = [
    {
        "element_type": "div",
        "element_class": "organisation-logo"
    },
    {
        "element_type": "h3",
        "element_class": "instituteName"
    },
    {
        "element_type": "h3",
        "element_class": "organization"
    },
    {
        "element_type": "div",
        "element_class": "profile-navigation"
    },
    {
        "element_type": "div",
        "element_class": "description"
    },
    {
        "element_type": "div",
        "element_class": "icon-container"
    },
    {
        "element_type": "div",
        "element_class": "tags"
    },
    {
        "element_type": "div",
        "element_class": "content-card"
    }
]

example_card_id = "mGPlfnn4uQ"

example_profile_id = "KnS2b3YBvlEAQnBvt8n4"