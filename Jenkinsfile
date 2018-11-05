pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				sh 'docker build -t transactions:0.1.${BUILD_NUMBER} .'
				sh 'docker create transactions:0.1.${BUILD_NUMBER} --name=transactions_0.1.${BUILD_NUMBER}'

				sh 'docker cp $(docker ps -a --filter "name=^/transactions_0.1.${BUILD_NUMBER}$"):/tmp/unittest.xml ./'
			}
		}

		stage ("Test"){
			steps {
				junit './unittest.xml'
			}
		}

		stage ("Deploy"){
			steps {
				echo "Build"
			}
		}
	}
}