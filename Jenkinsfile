pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				docker build -t transactions:0.1.${BUILD_NUMBER} .
				docker create transactions:0.1.${BUILD_NUMBER}

				docker cp ${docker ps -a --filter "ancestor=^/transactions:0.1.${BUILD_NUMBER}$"}:/tmp/unittest.xml ./
			}
		}

		stage ("Test"){
			steps {
				junit ./unittest.xml
			}
		}

		stage ("Deploy"){
			steps {
				echo "Build"
			}
		}
	}
}
