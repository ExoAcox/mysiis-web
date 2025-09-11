@Library(['shared-library', 'pipeline-library']) _

PipelineDockerEntry([
    // Project Name
    // Adalah nama dari project anda. Nama sudah ditentukan di awal, mohon tidak di ubah tanpa komunikasi dengan tim Playcourt
    projectName: 'mysiis',

    // Telegram Notification
    // Pada bagian ini anda dapat mengubah "telegramChatId" dengan chat id anda. Chat id akan digunakan untuk mengirim notifikasi setiap pipeline selesai
    telegramChatId: '-1001215679728',

    // Prerun Script
    // Pada bagian ini anda dapat menambahkan dan mengkonfigurasikan script untuk dijalankan sebelum melakukan test atau build service yang anda buat
    prerunAgent: 'Gitops', // "prerunAgent" dapat diubah sesuai dengan label agent pada https://jenkins.playcourt.id
    prerunAgentImage: 'playcourt/jenkins:nodejs14', // "prerunAgentImage" wajib didefinisikan jika menggunakan agent Docker
    prerunScript: {
        // "prerunScript" berisi groovy script yang akan dijalankan sebelum step test dan build
        // Pada bagian ini anda juga dapat membuat variable dan menggunakannya pada script yang lain

        // contoh script untuk mengambil secret dari Vault:
        def vaultEnv = env.BRANCH_NAME
        def vault = new Vault()
        SESSION_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'SESSION_KEY')
        SESSION_PASSWORD = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'SESSION_PASSWORD')
        NEXT_PUBLIC_TOKEN_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_TOKEN_KEY')
        NEXT_PUBLIC_REFRESH_TOKEN_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_REFRESH_TOKEN_KEY')
        NEXT_PUBLIC_GOOGLE_API_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_API_KEY')
        NEXT_PUBLIC_GOOGLE_KEY_ODP_VIEW = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_ODP_VIEW')
        NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA')
        NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND')
        NEXT_PUBLIC_GOOGLE_KEY_DISTRICT_VALIDATION = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_DISTRICT_VALIDATION')
        NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND')
        NEXT_PUBLIC_GOOGLE_KEY_IPCA = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_IPCA')
        NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA')
        NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA')
        NEXT_PUBLIC_FIREBASE_API_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_FIREBASE_API_KEY')
        NEXT_PUBLIC_NPS_SETTING_ID = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_NPS_SETTING_ID')
        NEXT_PUBLIC_OCA_TOKEN = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_OCA_TOKEN')
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY')
        NEXT_PUBLIC_API_KEY = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_API_KEY')
        NEXT_PUBLIC_TELKOM_USERNAME = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_TELKOM_USERNAME')
        NEXT_PUBLIC_MYSIIS_USERNAME = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_MYSIIS_USERNAME')
        NEXT_PUBLIC_MYSIIS_PASSWORD = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_MYSIIS_PASSWORD')
        NEXT_PUBLIC_NPS_PASSWORD = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_NPS_PASSWORD')
        NEXT_PUBLIC_RPA_WIBS_PASSWORD = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_RPA_WIBS_PASSWORD')
        NEXT_PUBLIC_ACCOUNT_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_ACCOUNT_URL')
        NEXT_PUBLIC_DISTRICT_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_DISTRICT_URL')
        NEXT_PUBLIC_ODP_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_ODP_URL')
        NEXT_PUBLIC_BUILDING_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_BUILDING_URL')
        NEXT_PUBLIC_ADDONS_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_ADDONS_URL')
        NEXT_PUBLIC_NEWS_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_NEWS_URL')
        NEXT_PUBLIC_CONTENT_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_CONTENT_URL')
        NEXT_PUBLIC_NOTIFICATION_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_NOTIFICATION_URL')
        NEXT_PUBLIC_NPS_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_NPS_URL')
        NEXT_PUBLIC_INDIHOME_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_INDIHOME_URL')
        NEXT_PUBLIC_DISPATCHING_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_DISPATCHING_URL')
        NEXT_PUBLIC_ACTIVITY_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_ACTIVITY_URL')
        NEXT_PUBLIC_MULTILAYER_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_MULTILAYER_URL')
        NEXT_PUBLIC_POINT_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_POINT_URL')
        NEXT_PUBLIC_SIIS_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_SIIS_URL')
        NEXT_PUBLIC_OCA_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_OCA_URL')
        NEXT_PUBLIC_MYSIISTA_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_MYSIISTA_URL')
        NEXT_PUBLIC_RPA_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_RPA_URL')
        NEXT_PUBLIC_SENTIMENT_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_SENTIMENT_URL')
        NEXT_PUBLIC_GSURVEY_URL = vault.vault("/cic/mysiis/${vaultEnv}/mysiis-web-main", 'NEXT_PUBLIC_GSURVEY_URL')
        // APP_KEY = vault.vault('ins/itmtest/develop/example', 'APP_KEY')
    },

    // Service Test
    // Pada bagian ini anda dapat menambahkan dan mengkonfigurasikan script untuk menjalankan test pada service yang anda buat
    testAgent: 'Docker', // "testAgent" dapat diubah sesuai dengan label agent pada https://jenkins.playcourt.id
    testAgentImage: 'playcourt/jenkins:nodejs18', // "testAgentImage" wajib didefinisikan jika menggunakan agent Docker
    // testAgentImage: 'node:19.2.0-alpine', // "testAgentImage" wajib didefinisikan jika menggunakan agent Docker
    runTestScript: {
        // "runTestScript" berisi groovy script untuk menjalankan test

        // contoh script untuk menjalankan test pada service nodejs
        sh "yarn install"
        sh "npm run coverage"
    },

    // Build Docker Image
    // Pada bagian ini anda dapat mengkonfigurasikan script untuk membuat image dari service yang anda buat
    imageName: 'mysiis-web-main', // "imageName" adalah nama dari service yang anda buat
    buildDockerImageScript: { String imageTag, String envStage ->
        // "buildDockerImageScript" berisi groovy script untuk melakukan build image
        // Image yang dibuat wajib menggunakan tag dari variable imageTag

        // contoh script untuk membuat image dan menggunakan variable yang dibuat pada prerunScript
        // sh "docker build --build-arg ARGS_NODE_BUILD=${envStage} --build-arg APP_KEY=${APP_KEY} --rm --no-cache -t ${imageTag} ."
        sh "echo \"SESSION_KEY='${SESSION_KEY}'\n\" >> .env"
        sh "echo \"SESSION_PASSWORD='${SESSION_PASSWORD}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_TOKEN_KEY='${NEXT_PUBLIC_TOKEN_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_REFRESH_TOKEN_KEY='${NEXT_PUBLIC_REFRESH_TOKEN_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_API_KEY='${NEXT_PUBLIC_GOOGLE_API_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_ODP_VIEW='${NEXT_PUBLIC_GOOGLE_KEY_ODP_VIEW}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA='${NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND='${NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_DISTRICT_VALIDATION='${NEXT_PUBLIC_GOOGLE_KEY_DISTRICT_VALIDATION}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND='${NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_IPCA='${NEXT_PUBLIC_GOOGLE_KEY_IPCA}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA='${NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA='${NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_FIREBASE_API_KEY='${NEXT_PUBLIC_FIREBASE_API_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_NPS_SETTING_ID='${NEXT_PUBLIC_NPS_SETTING_ID}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_OCA_TOKEN='${NEXT_PUBLIC_OCA_TOKEN}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_RECAPTCHA_SITE_KEY='${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_API_KEY='${NEXT_PUBLIC_API_KEY}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_TELKOM_USERNAME='${NEXT_PUBLIC_TELKOM_USERNAME}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_MYSIIS_USERNAME='${NEXT_PUBLIC_MYSIIS_USERNAME}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_MYSIIS_PASSWORD='${NEXT_PUBLIC_MYSIIS_PASSWORD}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_NPS_PASSWORD='${NEXT_PUBLIC_NPS_PASSWORD}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_RPA_WIBS_PASSWORD='${NEXT_PUBLIC_RPA_WIBS_PASSWORD}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_ACCOUNT_URL='${NEXT_PUBLIC_ACCOUNT_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_DISTRICT_URL='${NEXT_PUBLIC_DISTRICT_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_ODP_URL='${NEXT_PUBLIC_ODP_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_BUILDING_URL='${NEXT_PUBLIC_BUILDING_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_ADDONS_URL='${NEXT_PUBLIC_ADDONS_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_NEWS_URL='${NEXT_PUBLIC_NEWS_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_CONTENT_URL='${NEXT_PUBLIC_CONTENT_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_NOTIFICATION_URL='${NEXT_PUBLIC_NOTIFICATION_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_NPS_URL='${NEXT_PUBLIC_NPS_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_INDIHOME_URL='${NEXT_PUBLIC_INDIHOME_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_DISPATCHING_URL='${NEXT_PUBLIC_DISPATCHING_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_ACTIVITY_URL='${NEXT_PUBLIC_ACTIVITY_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_MULTILAYER_URL='${NEXT_PUBLIC_MULTILAYER_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_POINT_URL='${NEXT_PUBLIC_POINT_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_SIIS_URL='${NEXT_PUBLIC_SIIS_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_GSURVEY_URL='${NEXT_PUBLIC_GSURVEY_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_OCA_URL='${NEXT_PUBLIC_OCA_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_MYSIISTA_URL='${NEXT_PUBLIC_MYSIISTA_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_RPA_URL='${NEXT_PUBLIC_RPA_URL}'\n\" >> .env"
        sh "echo \"NEXT_PUBLIC_SENTIMENT_URL='${NEXT_PUBLIC_SENTIMENT_URL}'\n\" >> .env"
        // sh "cat .env"
        sh "docker build --build-arg ARGS_NODE_BUILD=${envStage} --rm --no-cache -t ${imageTag} ."
    },

    // Deployment
    // Pada bagian ini anda dapat mengkonfigurasi dimana service akan dideploy
    // Value dari variable ini sudah ditentukan di awal dan mohon tidak diubah tanpa komunikasi dengan tim Playcourt
    deployment: 'jtn',

    // Post Run Script
    // Pada bagian ini anda dapat menambahkan script untuk dijalankan setelah proses pada pipeline selesai
    postrunScript: [
        always: {
            // Pada bagian ini script akan dijalankan setiap pipeline selesai
        },

        success: {
            // Pada bagian ini script hanya akan dijalankan jika pipeline sukses
        },

        failure: {
            // Pada bagian ini script hanya akan dijalankan jika pipeline gagal
        }
    ]
])
