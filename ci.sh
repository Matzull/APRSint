echo "Starting linting"
echo "Running ruff in format mode"
ruff format .
echo "Running ruff in fix mode"
ruff --fix .
echo "Running ruff analysis"
ruff .
echo "Running pylint analysis"
mkdir -p Ci_Cd
pylint $(git ls-files '*.py') > Ci_Cd/pylintout
echo "Output saved to Ci_Cd/pylintout"
sudo act > Ci_Cd/act
echo "Output saved to Ci_Cd/act"