SCHEMAS=./schemas
LIB_MODULES=./aramex_lib
find "${LIB_MODULES}" -name "*.py" -exec rm -r {} \;
touch "${LIB_MODULES}/__init__.py"

generateDS --no-namespace-defs -o "${LIB_MODULES}/array_of_string.py" $SCHEMAS/array_of_string.xsd
generateDS --no-namespace-defs -o "${LIB_MODULES}/datatypes.py" $SCHEMAS/datatypes.xsd
generateDS --no-namespace-defs -o "${LIB_MODULES}/location.py" $SCHEMAS/location.xsd
generateDS --no-namespace-defs -o "${LIB_MODULES}/rates.py" $SCHEMAS/rates.xsd
generateDS --no-namespace-defs -o "${LIB_MODULES}/shipping.py" $SCHEMAS/shipping.xsd
generateDS --no-namespace-defs -o "${LIB_MODULES}/tracking.py" $SCHEMAS/tracking.xsd
