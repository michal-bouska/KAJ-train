# Komentář k hodnocení
* JS práce se SVG - vše mám v canvasu, tudíž SVG nepoužívám
* Offline aplikace - celá aplikace je offline a cachovana, takže nevím, jestli se to počítá do js/offline aplikace
* Použití JS frameworku či knihovny - používám knihovny Audio, LocalStorage, DnD, FileReader
* Použití pokročilých JS API - používám knihovny Audio, LocalStorage, DnD, FileReader
* Formulářové prvky - umožňuji vstup pomocí DaD a přetažení souboru
* Kompatabilita v prohlížečích - zkoušel jsem hru v [vivaldim](https://www.vivaldi.com), Firefoxu, Chromu, Opeře, zde by měla fungovat bez problémů. Hra funguje i v Edgy, kde ale nejdou zvuky, protože není podporováno Audio.
* Podpora mobilních telefonů - hra a celá webová stánka funguje na mobilních telefonech, jedinou podmínkou je mít telefon s klávesnicí. Buď to doporučuji Blackberry, nebo by mohlo fungovat OTG.
* Funkční historie - lze použít pro přechod mezi levly, pokud jsme byli v minulosti v jiném levelu

## Vzhledem k tomu, že si můžeme vybrat tři podbody, které jsme z důvodu nevhodnosti pro úlohu nesplnili, viděl bych to takto
* JS práce se SVG
* Formulářové prvky
* Použití JS frameworku či knihovny
* pokud, alespoň jeden z předchozích bodů je splněný, poté - využití JS API pro zjišťování stavu

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

## levels.js
V této třídě jsou poze uložené jednotlivé mapy.

