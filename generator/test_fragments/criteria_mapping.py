from .criteria_tests import CriteriaTests
from .example_data import card_details, profile_details

tests = CriteriaTests()



def test_placeholder(criteria):
    return [
        "// TODO: Please write test for acceptence criteria: " + criteria + "\n"
    ]

class CriteriaMapping:
    def __init__(self, result_class):
        self.result_class = result_class

    def get_criteria_test(self, criteria):
        criteria_map = {
            'Der Nutzer erhält ein Formular': tests.user_gets_form(self.result_class + 'Form'),
            'Der Nutzer kann das Formular absenden': tests.user_submits_form(),
            'Der Nutzer erhält eine Erfolgsmeldung': tests.user_gets_success_message(),
            'Nutzer kann Formular ausfüllen': ["// TODO: Implement test\n"],  # tests.user_fills_text_form(),
            'Formular-Absendung führt zu Login des Nutzers': tests.user_gets_logged_in(),
            'Der Login-Bereich erhält einen Passwort vergessen Link': tests.user_gets_pw_forgot_link(),
            'Der Nutzer-Bereich erhält einen Passwort ändern Link': tests.user_gets_pw_change_link(),
            'Der Nutzer-Bereich erhält einen Link zum Formular (Nutzerdaten ändern)': tests.user_gets_userdata_link(),
            'Der Nutzer kann ein Einzelgesuch ausklappen, um alle Daten zu sehen': tests.open_single_card(0),
            'Der Nutzer kann Filter einstellen': tests.enter_card_filters(),
            'Es werden pro Seite mind. 5 Ergebnisse gezeigt': tests.result_count_5(self.result_class),
            'Ein Ergebnis enthält mindestens den Titel': tests.check_title_available(self.result_class),
            'Der Nutzer kann ein Ergebnis anklicken und kommt auf die Detailseite': tests.click_result(self.result_class),
            'Der Nutzer erhält ein Suchformular': tests.user_gets_search_form(),
            'Der Nutzer kann zwischen den Seiten navigieren': tests.pagination(),
            'Der Nutzer kann mit dem Gesuch Kontakt aufnehmen': tests.user_can_contact_card(),
            'Der Nutzer sieht folgende Daten des Gesuchs in der Detailansicht…': tests.card_details_existence(
                card_details),
            'Der Nutzer kann zurück zur Übersicht springen': tests.back_to_overview(),
            'Absendung des Formulars führt zur Anlage des Gesuchs': tests.card_gets_created(),
            'Der Nutzer erhält eine Vorschau': tests.user_gets_preview(),
            'Der Nutzer kann das Gesuch veröffentlichen': tests.user_can_publish(),
            'Der Nutzer kann das Gesuch speichern': tests.user_can_save(),
            'Der Nutzer kann mit dem Profil Kontakt aufnehmen': tests.user_can_contact_profile(),
            'Der Nutzer sieht folgende Daten des Profils in der Detailansicht…': tests.detail_view_profile(
                profile_details),
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) hinzufügen': tests.user_can_add_reference(),
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) bearbeiten': tests.user_can_edit_reference(),
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) löschen': tests.user_can_delete_reference(),
            'Der Nutzer sieht seine vorhandenen Chats mit Bild, Namen und letzter Nachricht': tests.user_gets_chat_overview(),
            'Der Nutzer kann einen Chat auswählen': tests.user_selects_chat(),
            'Der Chat wird im Einzelchat-Bereich angezeigt': tests.chat_gets_displayed(),
            'Der Nutzer sieht bisherige Chatnachrichten': tests.user_gets_messages(),
            'Der Nutzer kann nach Fachrichtung filtern': tests.filter_card_subject(),
            'Der Nutzer kann nach Disziplin filtern': tests.filter_card_discipline(),
            'Der Nutzer kann nach Spezialisierung filtern': tests.filter_card_specialty()
        }

        return criteria_map.get(criteria, test_placeholder(criteria))







