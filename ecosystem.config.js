module.exports = {
  apps : [
    {
	  name: "adidas-tour",
	  script: "serve",
	  env: {
		NODE_ENV: "production",
		PM2_SERVE_PATH: "C:\\MMC\\kidzania-adidas-experience\\tour",
		PM2_SERVE_PORT: 8085,
		PM2_SERVE_SPA: "true",
		PM2_SERVE_HOMEPAGE: "./index.htm"
	  }
	},
    {
      name: "adidas-frontend",
      script: "serve",
      env: {
        NODE_ENV: "production",
        PM2_SERVE_PATH: "C:\\MMC\\kidzania-adidas-experience\\viewer",
        PM2_SERVE_PORT: 8090,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "./visor.html"
      }
    },
    {
      name: "adidas-backend",
      cwd: "C:/MMC/kidzania-adidas-experience/backend/",
      script: "dist/main.js",
      node_args: "--env-file=.env",
      env: {
        NODE_ENV: "production"
      }
    },
	{
	  name: "adias-grafana",
	  script: "C:/MMC/grafana/bin/grafana.exe",
	  args: "server --config=C:/MMC/grafana/conf/custom.ini --homepath=C:/MMC/grafana",
	  interpreter: "none",
	  cwd: "C:/MMC/grafana",
	  env: {
		NODE_ENV: "production"
	  }
	},
	{
      name: "adidas-chrome-viewer",
      script: "C:\\MMC\\kidzania-adidas-experience\\chrome-viewer\\chrome_3_monitores.bat",
      interpreter: "cmd.exe",
      interpreter_args: "/c",
      // El .bat solo lanza Chrome y termina. Con autorestart:true PM2 lo vuelve a
      // ejecutar sin parar y cada vez mata (taskkill) las ventanas recien abiertas.
      autorestart: false
    }
  ]
};