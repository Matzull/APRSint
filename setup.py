import setuptools

with open('README.md', 'r') as readme_file:
    readme = readme_file.read()

requirements = [
    'click',
    'requests',
    'sqlalchemy',
    'unidecode',
    'boto3',
    'tqdm',
]

setuptools.setup(
    name='APRSINT',
    version='0.0.1',
    author='Marcos Alonso Campillo',
    author_email='marcal16@ucm.es',
    description='',
    long_description=readme,
    long_description_content_type='text/markdown',
    url='',
    packages=setuptools.find_packages(),
    install_requires=requirements,
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.11',
    entry_points="""
        [console_scripts]
        app=project_id.cli.commands:cli
    """,
)
