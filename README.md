# ElectroVeloStation
## 1. Prérequis
* **PHP** (via XAMPP par exemple)
* **Composer**
* **Node.js & npm**

## 2. Installation des dépendances
Ouvrez un terminal à la racine du projet et lancez :
```bash
# Dépendances PHP (Laravel)
composer install

# Dépendances JavaScript (React / Vite)
npm install
```
## 3. Sécurité (etape importante)
Installez le .env sur le dossier racine du projet

Executez la commande suivante (.env nécéssaire)
```bash
php artisan key:generate
```
## 4. Visualiser le site
executez ces comandes en parallèles sur des terminaux à part :
```bash
php artisan serve
```
```bash
npm run dev
```
