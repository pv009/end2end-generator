import os

from test_fragments.test_template import TestTemplate
from test_fragments.test_writer import TestWriter



example_story = {
    "_id": "123456",
    "mainContext": "",
    "subContext": "",
    "userRole": "",
    "goal": "einen Screenshot machen",
    "reason": "um die Seite zu sehen",
    "acceptenceCriteria": [
        "Der Nutzer kann einen Screenshot machen"
    ]
}

writer_data = {
    "acceptence_criteria": example_story["acceptenceCriteria"]
}

template_data = {
    "spec_title": example_story["goal"]
}

test_writer = TestWriter(writer_data)
test_template = TestTemplate(template_data)
template = test_template.return_template()


class Composer:
    def __init__(self, data):
        self.file = open(self.file_name(), "w")

    # filename generator
    def file_name(self):
        filename = (example_story["goal"].replace(" ", "_") + "-" + example_story["reason"].replace(" ", "_")).lower()
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
        test_file.write(template['test_end'])
        self.blank_line()

    # Template writers
    def write_header(self):
        test_file = self.file
        self.write_array_values(template['basic_config']['imports'])

        test_file.write(template['spec_title'])
        
    def write_basic_config(self):
        self.write_array_values(template['basic_config']['test_variables'])
        self.write_array_values(template['basic_config']['before_all'])
        self.write_array_values(template['basic_config']['before_each'])
        self.write_array_values(template['basic_config']['after_all'])
        self.write_array_values(template['basic_config']['after_each'])


    # Test writers

    def write_single_tests(self):
        test_file = self.file
        for test in test_writer.return_written_tests():
            test_file.write(test)



    def compose_file(self):
        self.write_header()
        self.write_basic_config()
        self.write_single_tests()
        self.write_end()
        self.file.close()


