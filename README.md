# Projektuppgift | Backend-baserad webbutveckling DT207G
## Webbplats för en fiktiv restaurang

Uppgiften består av tre delar, en webbtjänst, en admin-sida och publik webbplats. I detta repo skapade jag den publika webbplatsen. 
Webbplatsen skapades som en fiktiv restaurang med namnet **Trattoria Lema**. 
Syftet är att besökare ska se statiskt och dynamiskt innehåll som genererats både från restaurangen, men även från personalen på admin-sidan.
Sidan skapades med HTML, Sass (SCSS) samt JavaScript och VITE.

**Webbplats:** https://trattoria-lema.netlify.app/  

**JSDoc:** https://trattoria-lema.netlify.app/docs/index.html

### Webbplatsens sidor
- Hem
- Boka bord
- Kvällsmeny
<p align="center">
<img align="center" width="800" height="475" alt="image" src="https://github.com/user-attachments/assets/163192f5-3c38-4399-8a82-033d7a077f18" />
</p>

## Funktionalitet  
- Beskrivning av den fiktiva Trattorian.
- Dynamiskt innehåll med maträtter och bilder i en kvällsmeny hämtat från webbtjänsten.
- Boka bord till kvällsmenyn.
- Sektioner med Öppettider, Hitta hit med karta samt fiktiva länkar till "undersidor" och goda råd.

Statiska bilder finns även med för att höja användarupplevelsen, exempelvis en hero-bild.

### Köra projektet lokalt
- git clone https://github.com/filipbergander/projektuppgift-restaurang.git
- npm install
- npm run dev


## Övrigt
Data som används på hemsidan hämtas in från backend genom admin-sidan och webbtjänsten.  
Fokus låg på att skapa en användarvänlig sida med god responsivitet, intressant innehåll och funktionalitet. Jag använde ikoner, animationer, aria-labels för att göra webbplatsen mer tillgänglig.
Tester för den responsiva designen gjordes på mobiltelefon (samsung), och webbläsarna Google Chrome, Microsoft Edge samt Mozilla Firefox. Validering gjordes i WCAG, WAVE, PageSpeed Insights och W3Cs testverktyg för HTML och stilmallar. Dokumentation för JavaScript skapades med JSDoc.

Min tanke, till en början, var att skapa både en lunchmeny och kvällsmeny men jag valde senare att fokusera på kvällsmenyn och förbättra den samt integrera med övrig funktionalitet.

*Filip Bergander Mittuniversitet*
