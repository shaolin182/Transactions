pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				sh 'docker build -t transactions:0.1.${BUILD_NUMBER} .'
				sh 'docker create --name=transactions_0.1.${BUILD_NUMBER} transactions:0.1.${BUILD_NUMBER}'

				sh 'docker cp $(docker ps -a -q --filter "name=^/transactions_0.1.${BUILD_NUMBER}$"):/tmp/ .'
			}
		}

		stage ("Linter"){
			steps {
				step([$class: 'WarningsPublisher',
					parserConfigurations: [[
						parserName: 'ESLint',
						pattern: 'eslint.xml'
					]],
					unstableTotalAll: '0',
					usePreviousBuildAsReference: true
				])
			}
		}

		stage ("Test"){
			steps {
				sh 'touch unittest.xml'
				junit 'unittest.xml'
			}
		}

		stage ("Code coverage"){
			steps {
				step([$class: 'CoberturaPublisher', autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/cobertura-coverage.xml', failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false])
			}
		}

		stage ("Deploy"){
			steps {
				echo "Build"
			}
		}
	}
}