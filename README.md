# Tvůrčí psaní — WebTest

## Správa webu

Po sloučení této změny a dokončení GitHub Actions otevřete:
https://mn-sys-cmyk.github.io/WebTest/admin/

Netlify ani jiná služba nejsou potřeba. Na GitHubu vytvořte **fine-grained personal access token**, vyberte vlastníka `MN-sys-cmyk`, pouze repozitář `WebTest` a oprávnění **Contents: Read and write**. Token vložte do přihlášení administrace; neposílejte jej do chatu. Je pouze v paměti otevřené stránky. Obnovení stránky nebo odhlášení vyžaduje nové přihlášení. Účet musí mít právo zapisovat do větve `main`.

- **Autoři:** jméno, zaměření, medailonek, fotografie a viditelnost. Autora s texty lze skrýt; před odstraněním jeho texty převeďte jinému autorovi nebo odstraňte.
- **Texty:** autor, název, datum, žánry, štítky, anotace, samostatné slovo autora, celý text a obrázek. Prázdné slovo autora se nezobrazuje. Text je prostý text: nový řádek zachová verš, prázdný řádek oddělí odstavec.
- **Koncept / Zveřejněno:** koncept není na webu. Zveřejněný text viditelného autora se automaticky objeví v katalogu, u autora a podle data mezi nejnovějšími texty. Skrytím autora se skryjí i jeho texty.
- **Štítky:** založte je v samostatné záložce, potom je přiřaďte textům. Přejmenování zachová přiřazení; používaný štítek nejprve odeberte z textů.
- **Fotografie:** JPG, PNG nebo WebP do 10 MB. Administrace zmenší delší stranu na nejvýše 1600 px. Nahrání obrázku a uložení obsahu jsou dva zápisy; nepoužité staré obrázky zůstávají v repozitáři.

Uložení provede zápis do GitHubu. Následné sestavení a publikování trvá obvykle chvíli; stav ověřte odkazem „Průběh publikování“ v administraci. Hláška o uložení potvrzuje zápis, ne dokončené nasazení. Pokud obsah mezitím upravil někdo jiný, editor zápis odmítne a ponechá rozepsané změny, aby nedošlo k přepsání cizí práce.

Repozitář je veřejný, a proto jsou koncepty a historie změn dostupné v GitHubu, i když nejsou na veřejném webu. Toto je jednoduchá testovací administrace pro vlastníka repozitáře.

## Data a publikování

Jediným zdrojem obsahu je `content/data.json`. Stabilní identifikátory drží odkazy i při přejmenování. Původní obsah a identifikátory byly zachovány; neexistující obrázky používají prázdnou hodnotu. Původní anotace nejsou vydávány za slovo autora.

`npm test` ověří model, vztahy, publikování a GitHub ukládání se simulovanými odpověďmi. Testovací vzorek je oddělený od živého obsahu, takže redakční změny nemění očekávané počty v testech. `npm run build` vytvoří `_site` pouze se zveřejněným obsahem. Pro lokální náhled obsluhujte tuto složku běžným statickým serverem. Zdrojovou složku nelze přímo nasadit: veřejný `data.js` vzniká až při sestavení.

Workflow `static.yml` testuje, sestavuje a nasazuje `_site` na GitHub Pages. `content.yml` kontroluje také pull requesty. GitHub Pages musí používat GitHub Actions (stejně jako před touto změnou). Chybné reference nebo chybějící publikované obrázky zastaví sestavení a ponechají předchozí nasazený web.
