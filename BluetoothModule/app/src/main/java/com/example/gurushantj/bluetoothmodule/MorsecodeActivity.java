package com.example.gurushantj.bluetoothmodule;

import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class MorsecodeActivity extends AppCompatActivity {

    Map<String,String>morseMap=null;
    int questionId=0;
   // Map<Integer,String>questionsMap=null;
    Map<String,HashMap<Integer,Question>> quesMap=null;
    public MorsecodeActivity()
    {

        quesMap=new HashMap<>();
        HashMap<Integer,Question>tempMap=new HashMap<>();
        Question ques=new Question("What is your birth year?","A");
        tempMap.put(1,ques);
        ques=new Question("What is your pet name?","AE");
        tempMap.put(2,ques);
        ques=new Question("What is your college passwout year?","A");
        tempMap.put(3,ques);
        quesMap.put("F4:8B:32:2F:4A:66",tempMap);
//
//        questionsMap=new HashMap<>();
//        questionsMap.put(1,"What is your pet name?");
//        questionsMap.put(2,"What is your SSC percentage?");
//        questionsMap.put(3,"What is birth year?");
        morseMap=new HashMap<>();
        morseMap.put(".-","A");
        morseMap.put("-...","B");
        morseMap.put("-.-.","C");
        morseMap.put("-..","D");
        morseMap.put(".","E");
        morseMap.put("..-.","F");

//        morseMap.put("","");
//        morseMap.put("","");
//        morseMap.put("","");
//        morseMap.put("","");
//        morseMap.put("","");


    }

    String bluetoothAddress=null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_morsecode);
            Switch modeSwitch = (Switch) findViewById(R.id.switch1);
            modeSwitch.setChecked(false);
            modeSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {

                    if (isChecked) {
                        Intent intent = new Intent(getApplicationContext(), Mode1Login.class);
                        startActivity(intent);
                    }

                }
            });
            Button submitButton = (Button) findViewById(R.id.button2);

            TextView questinoView = (TextView) findViewById(R.id.textView3);

            //fetching current bluetooth address
            HashMap<Integer, Question> tempMap = new HashMap<>();
            BluetoothUtil.getInstance();
            bluetoothAddress = BluetoothUtil.getBluetoothAddress();
            if (quesMap.containsKey(bluetoothAddress)) {
                tempMap = quesMap.get(bluetoothAddress);
            } else {
                Toast.makeText(getApplicationContext(),"You are not authorized to open the door",Toast.LENGTH_LONG).show();
                Intent intent=new Intent(getApplicationContext(),LoginActivity.class);
                startActivity(intent);
            }

            questionId = (int) (Math.random() * 3 + 1);


            questinoView.setText(tempMap.get(questionId).getQuestion());

            ;

//        Button dashButton=(Button)findViewById(R.id.dash);
//        Button dot=(Button)findViewById(R.id.dot);
//        Button spaceButton=(Button)findViewById(R.id.space_button);
//        dashButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                String morseText=((EditText)findViewById(R.id.textView2)).getText().toString();
//                morseText=morseText+"-";
//                ((EditText) findViewById(R.id.textView2)).setText(morseText);
//            }
//        });
//
//        dot.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                String morseText=((EditText)findViewById(R.id.textView2)).getText().toString();
//                morseText=morseText+".";
//                ((EditText) findViewById(R.id.textView2)).setText(morseText);
//            }
//        });
//
//        spaceButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                String morseText=((EditText)findViewById(R.id.textView2)).getText().toString();
//                morseText=morseText+" ";
//                ((EditText) findViewById(R.id.textView2)).setText(morseText);
//            }
//        });

            submitButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    String morseText = ((EditText) findViewById(R.id.textView2)).getText().toString();
                    String stringText = convertMorseToString(morseText);
                    Toast.makeText(getApplicationContext(), "Text is =>" + stringText, Toast.LENGTH_LONG).show();
                    writeToBluetooth(stringText);
                }
            });
        }
        catch (Exception ex)
        {

            StringWriter wr=new StringWriter();
            ex.printStackTrace(new PrintWriter(wr));
            ((EditText)findViewById(R.id.textView2)).setText(wr.toString());
        }


    }

    private void writeToBluetooth(String message)
    {

        String actualAns=quesMap.get(bluetoothAddress).get(questionId).getAns();
        if(!message.equals(actualAns))
        {
            Toast.makeText(getApplicationContext(),"Wrong answer,hence not authorized to open door",Toast.LENGTH_LONG).show();
            return;
        }
        else {
            Toast.makeText(getApplicationContext(),"You are welcome!!!",Toast.LENGTH_LONG).show();
            BluetoothUtil bluetoothUtilObj = BluetoothUtil.getInstance();
            bluetoothUtilObj.writeMessage("$" + questionId);
        }
    }

    private  String convertMorseToString(String morseText)
    {
        morseText=morseText.replaceAll("\n","");
        StringBuilder wordBuilder=new StringBuilder();
        String tempArr[]=morseText.split(" ");
        for(String morse:tempArr)
        {
            wordBuilder.append(morseMap.get(morse));
        }
        return wordBuilder.toString();
    }

}

class Question
{

    public Question(String question,String answer)
    {
        this.question=question;
        this.answer=answer;
    }

    public String getAns() {
        return answer;
    }

    public void setAns(String ans) {
        this.answer = ans;
    }


    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String question;
    public String answer;

}