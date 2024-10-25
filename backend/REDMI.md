----------------------------------------------------------------

TABLES COURRIERS

-numero_bordereaux : String
-date_depart : Date
-expiditeur : String
-destination : String
-id_nature: String

----------------------------------------------------------------

TABLES NATURES

-description : String
-nom_depose : String
-prenom_depose : String
-matricule : string


----------------------------------------------------------------

TABLES ARCHIVES

-description : String
-nom_depose : String
-prenom_depose : String
-matricule : string
-numero_bordereaux : string
-date_depart : Date
-expiditeur : string
-destination : string


----------------------------------------------------------------

TABLES JOURNALS

-action : String
-userName : String
-adressEmail : String
-imageJournale : string
-date : Date
-details : string
-user : string


----------------------------------------------------------------

TABLES TOKENS

-userId : String
-token : String
-createdAt : Date


----------------------------------------------------------------

TABLES USERS

-name : String
-email : String
-password : String
-role : string
-status : Date
-image : string
-tokens : string


----------------------------------------------------------------

TABLES VISAS

-numero_visa : String
-nom_depose_visa : String
-prenom_depose_visa : String
-reference : string


----------------------------------------------------------------