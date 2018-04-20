This WebExtension is a fork of the client for the [Passwords app for Nextcloud](https://github.com/marius-wieschollek/passwords) for Firefox and Chromium based browsers.
It is intended to work with the password manager for 1CRM some day in the future


Tasks to fulfill until it works:
* currently the extension fetches all credentials from the server on startup; need to search for Credentials through API (search -> show list of matching entities -> get detail with password)
* passwords in 1CRM are stored encrypted. API does not expose unencrypted PWs.
* Need to implement a way to only access single entities to be able to use 1CRM auditing
* enable oAuth2 authentication

#### Passwords always at hand
By clicking on the "Passwords"-icon, you will be presented with the login data that matches the current website. The desired user account can easily be inserted into existing login forms with one click. Alternatively, you can also copy the password to the clipboard.

#### Keep your passwords up-to-date
New and updated passwords will be detected automatically and can be saved to Nextcloud.

#### Integrated Search
If you are unable to find a user account, the practical search function is guaranteed to help you.

#### Firefox for Android
The client for Nextcloud Passwords is optimized for mobile devices and also works with Firefox for Android.


