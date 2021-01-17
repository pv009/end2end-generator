from .component_interaction import ComponentInteraction

interaction = ComponentInteraction()

home_url = "http://localhost:4200/"


class CriteriaTests:
    def __init__(self):
        print("Inited criteria tests")

    # 'Der Nutzer erhält ein Formular',
    def user_gets_form(self, form_name):
        test_fragments = interaction.find_form(form_name)
        return test_fragments

    # 'Der Nutzer kann das Formular absenden',
    def user_submits_form(self):
        test_fragments = ["// TODO: implement testing code for filling out form\n"]
        test_fragments += interaction.click_button_by_class("submit-button", "0")
        return test_fragments

    # 'Der Nutzer erhält eine Erfolgsmeldung'
    def user_gets_success_message(self):
        test_fragments = interaction.success_message()
        return test_fragments

    # 'Der Nutzer erhält eine Bestätigungs-Mail',
    def user_gets_verification_mail(self):
        test_fragments = ["// TODO: Find a way to implement this\n"]
        return test_fragments

    # 'Formular-Absendung führt zur Erstellung eines Nutzer-Accounts'
        test_fragments = interaction.check_element_disappear("app-login")
        return test_fragments

    # Nutzer kann Formular ausfüllen
    def user_fills_text_form(self, form_controls, values):
        test_fragments = [""]
        for index, control in enumerate(form_controls):
            test_fragments += interaction.fill_text_input(control, values[index])

        return test_fragments

    # TODO: Mixed forms?

    # 'Formular-Absendung führt zu Login des Nutzers'
    def user_gets_logged_in(self):
        test_fragments = ["// TODO: implement testing code for filling out form\n"]
        test_fragments += interaction.click_button_by_id("submit-button"),
        test_fragments += interaction.page_switch(home_url + "/login", home_url + "/cards/list")
        print(test_fragments)
        return test_fragments

    # 'Der Login-Bereich erhält einen Passwort vergessen Link',
    def user_gets_pw_forgot_link(self):
        test_fragments = interaction.find_element_by_html("a", "Passwort vergessen")
        return test_fragments

    # 'Der Nutzer-Bereich erhält einen Passwort ändern Link',
    def user_gets_pw_change_link(self):
        test_fragments = interaction.find_element_by_html("a", "Passwort ändern")
        return test_fragments

    # 'Der Nutzer-Bereich erhält einen Link zum Formular (Nutzerdaten ändern)',
    def user_gets_userdata_link(self):
        test_fragments = [""]
        test_fragments += interaction.open_navigation()
        test_fragments += interaction.click_navigation_link("1")
        test_fragments += interaction.find_element_by_html("span", "Nutzerdaten bearbeiten")
        return test_fragments


    # 'Die Daten des Nutzers aktualisieren sich nach Formular-Absendung'
    def user_data_get_actualized(self):
        test_fragments = ["// TODO: Find a way to implement this\n"]
        return test_fragments

    # 'Der Nutzer kann ein Einzelgesuch ausklappen, um alle Daten zu sehen',
    def open_single_card(self, index):
        selector = ".fullview-button:first-of-type"
        test_fragments = interaction.click_any_button(selector)
        return test_fragments


        # 'Der Nutzer kann Filter einstellen',
    def enter_card_filters(self):
        test_fragments = [""]
        selectors = [
            "mat-select[placeholder=\"Wählen Sie Ihre Fachrichtung\"]",
            "mat-select[placeholder=\"Wählen Sie Ihre Disziplin\"]",
            "mat-select[placeholder=\"Wählen Sie Ihre Spezialisierung\"]"
        ]
        values = [
            "Naturwissenschaften",
            "Physik",
            "Festkörperphysik"
        ]
        
        for index, selector in enumerate(selectors):
            test_fragments += interaction.select_dropdown_by_placeholder(selector, values[index])

        return test_fragments

    # Der Nutzer kann nach Fachrichtung filtern
    def filter_card_subject(self):
        test_fragments = [""]
        selector = "mat-select[placeholder=\"Wählen Sie Ihre Fachrichtung\"]"
        test_fragments += interaction.select_dropdown_by_placeholder(selector, "Naturwissenschaften")
        return test_fragments

    # Der Nutzer kann nach Disziplin filtern
    def filter_card_discipline(self):
        test_fragments = [""]
        selector = "mat-select[placeholder=\"Wählen Sie Ihre Disziplin\"]"
        test_fragments += interaction.select_dropdown_by_placeholder(selector, "Physik")
        return test_fragments

    # Der Nutzer kann nach Spezialisierung filtern
    def filter_card_specialty(self):
        test_fragments = [""]
        selector = "mat-select[placeholder=\"Wählen Sie Ihre Spezialisierung\"]"
        test_fragments += interaction.select_dropdown_by_placeholder(selector, "Festkörperphysik")
        return test_fragments

    # 'Es werden pro Seite 30 Ergebnisse gezeigt',
    def result_count_5(self, result_class):
        test_fragments = interaction.enough_elements("single" + result_class.capitalize() + "Container", "5")
        return test_fragments


    # 'Ein Ergebnis enthält mindestens den Titel',
    def check_title_available(self, result_type):
        test_fragments = [""]
        if result_type == "profile":
            test_fragments += interaction.check_existence_by_selector("h3.organization")
        elif result_type == "card":
            test_fragments += interaction.check_existence_by_selector(".text-infos>h2")

        return test_fragments
        # TODO: Implement correct selector?


    # 'Der Nutzer kann ein Ergebnis anklicken und kommt auf die Detailseite',
    def click_result(self, result_type):
        test_fragments = [""]
        print("result class " + result_type)
        start_url = home_url + "/cards/list"
        if result_type == "profile":
            selector = ".singleProfile:first-of-type"
            test_fragments += interaction.click_any_button(selector)
            test_fragments += interaction.page_switch(start_url, home_url + "/profiles/es/")
            return test_fragments

        elif result_type == "card":
            selector = ".card-image:first-of-type"
            start_url += "/cards"
            test_fragments += interaction.click_any_button(selector)
            test_fragments += interaction.page_switch(start_url, home_url + "/cards")
            return test_fragments

        return test_fragments



    # TODO: Check correct urls

    # 'Der Nutzer erhält ein Suchformular',
    def user_gets_search_form(self):
        test_fragments = interaction.check_element_existence("form", "search-form")
        return test_fragments


    # 'Der Nutzer kann zwischen den Seiten navigieren'
    def pagination(self):
        test_fragments = [""]
        test_fragments += interaction.click_button_by_class("pageNumber", "1")

        return test_fragments


    # 'Der Nutzer kann mit dem Gesuch Kontakt aufnehmen',
    def user_can_contact_card(self):
        old_url = "https://localhost:4200/cards/[cardid]"
        new_url = "https://localhost:4200/chat/overview/[cardid]"
        test_fragments = [""]
        test_fragments += interaction.click_any_button(".partner-infos button")
        test_fragments += interaction.page_switch(old_url, new_url)  # TODO: URLS
        test_fragments += interaction.check_element_existence("form", "contact-form")

        return test_fragments


    # 'Der Nutzer sieht folgende Daten des Gesuchs in der Detailansicht…',
    def card_details_existence(self, html_elements):
        example_id = "4cP5iLUVSZ"
        detail_view_url = "http://localhost:4200/cards/" + example_id
        test_fragments = [""]
        test_fragments += interaction.navigate_to_url(detail_view_url)


        for element in html_elements:
            test_fragments += interaction.check_element_existence(element["element_type"], element["element_class"])

        return test_fragments


    # 'Der Nutzer kann zurück zur Übersicht springen'
    def back_to_overview(self):
        example_id = "4cP5iLUVSZ"
        detail_view_url = "http://localhost:4200/cards/" + example_id
        test_fragments = [""]
        test_fragments += interaction.navigate_to_url(detail_view_url)
        test_fragments += interaction.click_button_by_class("back-button", "1")
        test_fragments += interaction.page_switch("/cards", "/cards/list")  # TODO: Correct old url

        return test_fragments


    # 'Absendung des Formulars führt zur Anlage des Gesuchs',
    def card_gets_created(self):
        example_title = "Titel Testing"
        test_fragments = [""]
        test_fragments += interaction.click_button_by_id("submit-button")
        test_fragments += interaction.navigate_to_url("http://localhost:4200/cards/my-cards")
        test_fragments += interaction.click_any_button(".tabButton:nth-of-type(2)")
        test_fragments += interaction.find_element_by_html("h2", example_title)

        return test_fragments


    # 'Der Nutzer kann Tags eingeben',
    # TODO !!

    # 'Der Nutzer erhält eine Vorschau',
    def user_gets_preview(self):
        test_fragments = interaction.check_element_existence("div", "preview")
        ## TODO: Check correct parameters
        return test_fragments


    # 'Der Nutzer kann das Gesuch veröffentlichen',
    def user_can_publish(self):
        test_fragments = [""]
        test_fragments += interaction.click_button_by_class("publish-button", "0")
        test_fragments += interaction.success_message()

        return test_fragments


    # 'Der Nutzer kann das Gesuch speichern'
    def user_can_save(self):
        test_fragments = [""]
        test_fragments += interaction.click_button_by_class("save-button", "0")
        test_fragments += interaction.success_message()

        return test_fragments


    # 'Der Nutzer kann mit dem Profil Kontakt aufnehmen',
    def user_can_contact_profile(self):
        test_fragments = [""]
        test_fragments += interaction.click_any_button(".contact-container button")
        test_fragments += interaction.page_switch("", "/chat/overview")  # TODO: URLS

        return test_fragments


    # 'Der Nutzer sieht folgende Daten des Profils in der Detailansicht…',
    def detail_view_profile(self, html_elements):
        test_fragments = [""]

        for element in html_elements:
            test_fragments += interaction.check_element_existence(element["element_type"], element["element_class"])

        return test_fragments


    # 'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) hinzufügen',
    def go_to_research_reference(self):
        start_url = "http://localhost:4200/cards/my-cards"
        test_fragments = [""]
        test_fragments += interaction.navigate_to_url(start_url)
        test_fragments += interaction.click_any_button("#profile-navigation>a:nth-of-type(3)")

        return test_fragments


    def user_can_add_reference(self):
        test_fragments = self.go_to_research_reference()
        test_fragments += interaction.click_button_by_class("add-button", "0")
        test_fragments += interaction.lightbox_opened("profile-reference")

        return test_fragments


    # 'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) bearbeiten',
    def user_can_edit_reference(self):
        test_fragments = self.go_to_research_reference()
        test_fragments += interaction.click_button_by_class("edit-button", "0")
        test_fragments += interaction.lightbox_opened("profile-reference")

        return test_fragments


    # 'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) löschen',
    def user_can_delete_reference(self):
        test_fragments = self.go_to_research_reference()
        test_fragments += interaction.click_button_by_class("edit-button", "1")
        test_fragments += interaction.lightbox_opened("profile-reference")

        return test_fragments


    # 'Der Nutzer sieht seine vorhandenen Chats mit Bild, Namen und letzter Nachricht',
    def user_gets_chat_overview(self):
        start_url = "http://localhost:4200/chat/overview"
        test_fragments = [""]
        test_fragments += interaction.navigate_to_url(start_url)

        html_elements = [
            {
                "type": "img",
                "class": "chatLogo"
            },
            {
                "type": "p",
                "class": "chatTitle"
            },
            {
                "type": "p",
                "class": "lastMessage"
            }
        ]
        for element in html_elements:
            test_fragments += interaction.check_element_existence(element["type"], element["class"])

        return test_fragments


    # 'Der Nutzer kann einen Chat auswählen',
    def user_selects_chat(self):
        test_fragments = interaction.click_any_button(".singleChat:first-of-type")
        return test_fragments


    # 'Der Chat wird im Einzelchat-Bereich angezeigt',
    def chat_gets_displayed(self):
        test_fragments = interaction.check_element_existence("app-singlechat", "single-chat")
        # TODO: Add class to portal
        return test_fragments


    # 'Der Nutzer sieht bisherige Chatnachrichten',
    def user_gets_messages(self):
        test_fragments = [""]
        return test_fragments

        'Der Nutzer kann eine neue Nachricht eintippen',

        'Der Nutzer kann die Nachricht absenden',

        'Die neue Nachricht wird im Chat angezeigt',
