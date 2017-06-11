# Komentář k hodnocení
* JS práce se SVG - vše mám v canvasu
* Použití JS frameworku či knihovny - používám knihovny Audio, LocalStorage, DnD, FileReader
* Použití pokročilých JS API - používám knihovny Audio, LocalStorage, DnD, FileReader
* Formulářové prvky - umožňuji vstup pomocí DaD a přetažení souboru

## Vzhledem k tomu, že si můžeme vybrat tři podbody, které jsme z důvodu nevhodnosti pro úlohu nesplnili, viděl bych to takto
* JS práce se SVG
* Formulářové prvky
* Použití JS frameworku či knihovny

# Implementace

## train.js
Tento soubor obsluhuje funkcionalitu týkající se jedné hry. A to hlavně pomocí třídy Game.
### Třída Game
V této třídě probíhá inicializace hry, odchytávání kláves a reakce na ně.
Jako vstupní parametry očekává instanci mapy ze souboru levels.js, popřípadě dodanou pomocí DaD.
Také dva callbacky jeden pro překreslení rozhraní a druhý pro restartovaní uživatelského rozhraní.

## interface.js
Tento soubor se stará hlavně o obsluhu interfacu a to hlavně pomocí třídy OverallInterface.
### Třída OverallInterface
Tato třída se stará o vykreslování interfacu a jeho průběžné překreslovaní při hře.
Taktéž se stará o obsluhu DaD.
A jako poslední důležitou vlastnost, tato třída vytváří a ničí instance her.

## init.js
V tomto skriptu jsou hlavně inicializační prvky, konkrétně detekce jestli se jedná a edge.
Jednu dobu zde sídlil polymorfismus.