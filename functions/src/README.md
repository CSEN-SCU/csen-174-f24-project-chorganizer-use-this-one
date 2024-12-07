## How to use sendEmail Notification firebase function

```[javascript]
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const sendEmailNotification = httpsCallable(functions, 'sendEmailNotification');
sendEmailNotification({ to, subject, text, html});
```