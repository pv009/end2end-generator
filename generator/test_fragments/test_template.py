from .basic_config import BasicConfig

config_data = {
    "viewHeight": "1920",
    "viewWidth": "1080",
    "viewZoom": "1"
}

basic_config = BasicConfig(config_data)

test_template = {
    "basic_config": set(),
    "spec_title": "",
    "test_end": ""
}

class TestTemplate:
    def __init__(self, data):
        print('Inited test template')
        self.spec_title = data["spec_title"]

    def import_basic_config(self):
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


