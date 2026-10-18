<#
  Crea la base adidas3d y aplica database/schema.sql (PostgreSQL).
  Uso (desde la raiz del repo):  .\scripts\setup-db.ps1
  Requiere psql en el PATH (instalado con PostgreSQL).
#>
param(
  [string]$PgHost = "localhost",
  [int]$PgPort = 5432,
  [string]$PgUser = "postgres",
  [string]$DbName = "adidas3d"
)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

$exists = & psql -h $PgHost -p $PgPort -U $PgUser -d postgres -Atc "SELECT 1 FROM pg_database WHERE datname='$DbName'"
if (-not $exists) {
  & psql -h $PgHost -p $PgPort -U $PgUser -d postgres -c "CREATE DATABASE $DbName"
}
& psql -h $PgHost -p $PgPort -U $PgUser -d $DbName -v ON_ERROR_STOP=1 -f "$root\database\schema.sql"

if (-not (Test-Path "$root\backend\.env")) {
  Copy-Item "$root\backend\.env.example" "$root\backend\.env"
  Write-Host "Se creo backend\.env: edita PG_PASS con tu contrasena de PostgreSQL."
}
Write-Host "Base de datos lista."
