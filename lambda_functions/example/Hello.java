package example;

import com.amazonaws.services.lambda.runtime.Context; 

public class Hello {
    public String myHandler(int myCount, Context context) {
        return String.valueOf(myCount);
    }
}