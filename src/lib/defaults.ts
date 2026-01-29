export const DEFAULT_DIAGRAM = `graph TD
    Start([User visits site]) --> Auth{Authenticated?}
    Auth -->|Yes| Dashboard[Dashboard]
    Auth -->|No| Login[Login Page]
    Login --> Validate{Valid credentials?}
    Validate -->|Yes| Dashboard
    Validate -->|No| Error[Show error]
    Error --> Login
    Dashboard --> Profile[View Profile]
    Dashboard --> Settings[Settings]
    Dashboard --> Logout[Logout]
    Logout --> Start`;

export const DEFAULT_THEME = "tokyo-night";
