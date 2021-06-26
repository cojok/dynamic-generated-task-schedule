# Sequence diagram
```
plantuml
@startuml
actor CLIENT as user
participant PASSWORD_MANAGER as pass_man

user -> pass_man: /auth/login
pass_man -> user: auth_token
user -> pass_man: /password-manager/save
pass_man -> user: ok
@enduml
```