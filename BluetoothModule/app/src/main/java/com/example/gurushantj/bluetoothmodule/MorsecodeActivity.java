package com.example.gurushantj.bluetoothmodule;

import android.content.Intent;
import android.os.Bundle;
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

import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class MorsecodeActivity extends AppCompatActivity {

    Map<String,String>morseMap=null;
    int questionId=0;
    Map<Integer,String>questionsMap=null;
    public MorsecodeActivity()
    {


        questionsMap=new HashMap<>();
        questionsMap.put(1,"What is your pet name?");
        questionsMap.put(2,"What is your SSC percentage?");
        questionsMap.put(3,"What is birth year?");
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_morsecode);
        Switch modeSwitch=(Switch)findViewById(R.id.switch1);
        modeSwitch.setChecked(false);
        modeSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {

                if(isChecked)
                {
                    Intent intent=new Intent(getApplicationContext(),Mode1Login.class);
                    startActivity(intent);
                }

            }
        });
        Button submitButton=(Button)findViewById(R.id.button2);
        questionId = (int )(Math.random() * 3 + 1);
        TextView questinoView=(TextView)findViewById(R.id.textView3);
        questinoView.setText(questionsMap.get(questionId));


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
                String morseText=((EditText)findViewById(R.id.textView2)).getText().toString();
                String stringText=convertMorseToString(morseText);
                Toast.makeText(getApplicationContext(),"Text is =>"+stringText,Toast.LENGTH_LONG).show();
                writeToBluetooth(stringText);
            }
        });



    }

    private void writeToBluetooth(String message)
    {
        BluetoothUtil bluetoothUtilObj=BluetoothUtil.getInstance();
        bluetoothUtilObj.writeMessage("$"+questionId);

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
