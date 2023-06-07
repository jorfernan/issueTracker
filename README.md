# Compile JSX
npm install --save-dev @babel/preset-react@7
npx babel src --presets @babel/react --out-dir public 

# Older browser support
npm install --no-save @babel/plugin-transform-arrow-functions@7
npx babel src --presets @babel/react --plugins=@babel/plugin-transform-arrow-functions --out-dir public

# Automatic preset choice support
1. npm install --save-dev @babel/preset-env@7
2. Generate .babelrc file
3. npx babel src --out-dir public
4. Add the following script to packge.json: "compile": "babel src --out-dir public"
5. Automatic transpilation: "watch": "babel src --out-dir public --watch --verbose"

# Automatic transpilation
1. npm install nodemon
2. "start": "nodemon -w server server/server.js"

# Props vs State
| Attribute    | State                                  | Props                          |
| ------------ | -------------------------------------- | ------------------------------ |
| Mutability   | Can be changed using `this.setState()` | Cannot be changed              |
| Ownership    | Belongs to the component               | Belongs to an ancestor         |
| Information  | Model information                      | Model information              |
| Affects      | Rendering of the component             | Rendering of the component     |

# Communication
State flows as props into children, events cause state changes, which flows back as props.

# CRUD MAPPING FOR HTTP METHODS 
| Operation     | Method | Resource   | Example               | Remarks                                     |
|-------------- | ------ |----------- |---------------------- |------------------------------------------------------------------------------ |
| Read - List   | GET    | Collection | GET /customers        | Lists objects (additional query string can be used for filtering and sorting) |
| Read          | GET    | Object     | GET /customers/1234   | Returns a single object (query string may be used to specify which fields)    |
| Create        | POST   | Collection | POST /customers       | Creates an object with the values specified in the body                       |
| Update        | PUT    | Object     | PUT /customers/1234   | Replaces the object with the one specified in the body                        |
| Update        | PATCH  | Object     | PATCH /customers/1234 | Modifies some properties of the object, as specified in the body              |
| Delete        | DELETE | Object     | DELETE /customers/1234| Deletes the object                                                            |

# Custom Scalar Types

JSON has no Date type, so all dates must be transferred as strings in API Calls. For that, the recomended format is **ISO 8601**
Same format as Javascript Date's to JSON() method.

Ex:  26 January 2019, 2:30 PM UTC --> 2019-01-26T14:30:00.000Z

Date -> String: Coversion is made by  toJSON() or the toISOString() methods of Date
String -> Date: new Date(dateString).

GraphQL does not support dates natively, but has support to custom scalar types. In order to use a scalar type the following has to be done:

1. Define a type for the scalar using the **scalar keyword** instead for the **type keyword** in the schema.

2. Add a top-level resolver for all scalar types, which handles both serialization (WAY OUT) as well as parsing (WAY IN) via class methods