package org.test;

import java.io.IOException;
import java.util.Scanner;

import com.asual.lesscss.LessEngine;
import com.asual.lesscss.LessException;

public class Test {

	public static void main(String[] args) {
		// Instantiates a new LessEngine
		LessEngine engine = new LessEngine();

		// Compiles an URL resource
		try {
			// Compiles a CSS string
			String text = engine.compile("div { width: 1 + 1 }",true);
			System.out.println("out = "+ text);
			Scanner scanner = new Scanner(Test.class.getClassLoader().getResource("META-INF/bootstrap-3.0.0/1bootstrap.less").openStream());
			StringBuffer buffer = new StringBuffer();
			while(scanner.hasNext()){
				buffer.append(scanner.nextLine());
			}
			text = engine.compile(buffer.toString(),false);
			System.out.println("out = "+ text);
//			String url = engine.compile(input,false);
//			System.out.println("out = "+ url);

		} catch (LessException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}


	}

}
