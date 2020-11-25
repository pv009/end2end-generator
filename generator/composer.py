from ..test_fragments import test_template

test_template = test_template()
#template = set()


class Composer:
    def __init__(self, data):
        self.file = open("../finished_tests/" + data['filename'], "w")
        self.template = test_template.return_template()

    def write_header(self):
        template = self.template
        for single_import in template['basic_config']['imports']:
            self.file.write(single_import)
        self.file.close()



