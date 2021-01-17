import os

from test_fragments.test_template import TestTemplate
from test_fragments.test_writer import TestWriter
from test_fragments.criteria_mapping import CriteriaMapping
from test_fragments.criteria_tests import CriteriaTests
from test_fragments.example_data import card_details, profile_details


writer_data = {
    "acceptence_criteria": ""
}

template_data = {
    "spec_title": "",
    "context": "",
}

test_writer = TestWriter(writer_data)

class Composer:
    def __init__(self, data):
        self.story = data["story"]
        self.file = open(self.file_name(), "w")
        complete_context = self.story["mainContext"] + ':' + self.story["subContext"]
        self.context = self.transform_context(complete_context)

        template_data["spec_title"] = data["story"]["goal"]
        template_data["context"] = complete_context

        self.test_template = TestTemplate(template_data)
        self.template = self.test_template.return_template()

        writer_data["acceptence_criteria"] = data["story"]["acceptanceCriteria"]

    def transform_context(self, context):
        context_map = {
            'User-Verwaltung:Registrierung': 'register',
            'User-Verwaltung:Login': 'login',
            'User-Verwaltung:Passwort vergessen': 'email',
            'User-Verwaltung:Passwort ändern': 'password',
            'User-Verwaltung:Nutzerdaten ändern': 'userData',
            'Gesuche:Übersicht': 'card',
            'Gesuche:Detailansicht': 'detailView',
            'Gesuche:Anlage': 'createRequest',
            'Gesuche:Bearbeitung': 'editRequest',
            'Gesuche:Filter': 'filter',
            'Profile:Übersicht': 'profile',
            'Profile:Detailansicht': 'detailView',
            'Profile:Anlage': 'createProfile',
            'Profile:Bearbeitung': 'editProfile',
            'Profile:Forschungsreferenzen': 'project',
            'Chat:Übersicht': 'overview',
            'Chat:Einzelchat': 'singleChat',
            'Kontakt:Feedback': 'feedback',
            'Kontakt:Support': 'contact'
        }

        return context_map.get(context, 'context')

    # filename generator
    def file_name(self):
        filename = (self.story["goal"].replace(" ", "_") + "-" + self.story["reason"].replace(" ", "_")).lower()
        script_dir = os.path.dirname(__file__)
        relative_path = "./finished_tests/" + filename + ".spec.ts"
        absolute_path = os.path.join(script_dir, relative_path)
        return absolute_path


    # Helpers for cleaner code
    def blank_line(self):
        self.file.write("\n")


    def write_array_values(self, values):
        test_file = self.file
        for value in values:
            test_file.write(value)
        self.blank_line()

    def write_end(self):
        test_file = self.file
        test_file.write(self.template['test_end'])
        self.blank_line()

    # Template writers
    def write_header(self):
        test_file = self.file
        self.write_array_values(self.template['basic_config']['imports'])

        test_file.write(self.template['spec_title'])
        
    def write_basic_config(self):
        self.write_array_values(self.template['basic_config']['test_variables'])
        self.write_array_values(self.template['basic_config']['before_all'])
        self.write_array_values(self.template['basic_config']['before_each'])
        self.write_array_values(self.template['basic_config']['after_all'])
        self.write_array_values(self.template['basic_config']['after_each'])

    # Test writers
    def write_single_tests(self):
        test_file = self.file
        for index, criteria in enumerate(writer_data["acceptence_criteria"]):
            if index < len(writer_data["acceptence_criteria"]) - 1:
                all_tests = CriteriaMapping(self.context)
                test_fragments = all_tests.get_criteria_test(criteria)
                self.write_test_begin(criteria)
                for line in test_fragments:
                    test_file.write(line)

                self.write_test_end()


    def write_test_begin(self, criteria):
        test_file = self.file
        self.blank_line()
        test_file.write("it(\'" + criteria + "\', async (done: DoneFn) => {\n")

    def write_test_end(self):
        test_file = self.file
        test_file.write("await browser.close().then(() => done());\n")
        test_file.write("});\n")
        self.blank_line()

    def compose_file(self):
        self.write_header()
        self.write_basic_config()
        self.write_single_tests()
        self.write_end()
        self.file.close()


