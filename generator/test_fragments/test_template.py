from .basic_config import BasicConfig

test_template = {
    "basic_config": set(),
    "spec_title": "",
    "test_end": ""
}

class TestTemplate:
    def __init__(self, data):
        print('Inited test template')
        self.spec_title = data["spec_title"]
        self.context = data["context"]

    def import_basic_config(self):
        config_data = {
            "viewHeight": "1920",
            "viewWidth": "1080",
            "viewZoom": "1",
            "startURL": self.start_url(self.context)
        }
        basic_config = BasicConfig(config_data)

        test_template['basic_config'] = basic_config.set_global_config()

    def build_spec_title(self):
        test_template['spec_title'] = "describe('" + self.spec_title + "', () => {\n"

    def build_test_end(self):
        test_template['test_end'] = "});\n"

    def return_template(self):
        self.import_basic_config()
        self.build_spec_title()
        self.build_test_end()

        return test_template

    def start_url(self, context):
        context_url_map = {
            'User-Verwaltung:Registrierung': 'register',
            'User-Verwaltung:Login': 'login',
            'User-Verwaltung:Passwort vergessen': 'forgot-password',
            'User-Verwaltung:Passwort ändern': 'change-password',
            'User-Verwaltung:Nutzerdaten ändern': 'update-profile',
            'Gesuche:Übersicht': 'cards/list/cards',
            'Gesuche:Detailansicht': 'cards/5DXJnJIVtA',
            'Gesuche:Anlage': 'cards/create-request',
            'Gesuche:Bearbeitung': 'cards/edit/1V930rg5I1',
            'Gesuche:Filter': 'cards/list/cards',
            'Profile:Übersicht': '',
            'Profile:Detailansicht': 'profiles/es/H1chAXQB8DfeOPYu9vtC',
            'Profile:Anlage': 'profiles/create-profile',
            'Profile:Bearbeitung': 'profiles/edit-profile',
            'Profile:Forschungsreferenzen': 'cards/my-cards',
            'Chat:Übersicht':  'chat/overview',
            'Chat:Einzelchat': 'chat/overview',
            'Kontakt:Feedback': 'feedback',
            'Kontakt:Support': ' // TODO: Correct URL'
        }
        return context_url_map.get(context, ' // TODO: Correct URL')
