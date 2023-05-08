package com.example.moodleclone;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

public class OTPActivity extends AppCompatActivity {

    private EditText otpCode1, otpCode2, otpCode3, otpCode4, otpCode5, otpCode6;
    private TextView phone_number;

    private Button goBack;
    private Button checkOTP;
    private boolean back = false;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otpactivity);

        phone_number = findViewById(R.id.phone_number);
        String phoneNumber = null;
        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        goBack = findViewById(R.id.goBackToLogin);
        checkOTP = findViewById(R.id.verifyOTP);

        otpCode1 = findViewById(R.id.otp_id1);
        otpCode2 = findViewById(R.id.otp_id2);
        otpCode3 = findViewById(R.id.otp_id3);
        otpCode4 = findViewById(R.id.otp_id4);
        otpCode5 = findViewById(R.id.otp_id5);
        otpCode6 = findViewById(R.id.otp_id6);

        setupInputs();

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent goBackToLogin = new Intent(getApplicationContext(), LoginActivity.class);
                startActivity(goBackToLogin);
                finish();
            }
        });
        Log.d(TAG, "Back to login is: " + back);
        if (bundle != null) {
            if (bundle.getString("phone_number") == null) {
                phone_number.setText("Numar de telefon invalid. Contacteaza secretariatul!\n" +
                        "Vei fi redirectat la pagina de autentificare in 10 secucnde!");
                    int timeout = 10000;
                    Timer timer = new Timer();
                    timer.schedule(new TimerTask() {
                        @Override
                        public void run() {
                            finish();
                            Intent forceGoToLogin = new Intent(getApplicationContext(), LoginActivity.class);
                            startActivity(forceGoToLogin);
                            finish();
                        }
                    }, timeout);

            } else {
                phone_number.setText("Numar de telefon: +4" + bundle.getString("phone_number"));
            }
        } else {
            Log.e(TAG, "Could not retrieve the phone number");
        }
        checkOTP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String otpCode = otpCode1.getText().toString() + otpCode2.getText().toString() +
                        otpCode3.getText().toString() + otpCode4.getText().toString() + otpCode5.getText().toString() +
                        otpCode6.getText().toString();
                Log.d(TAG, "OTP Code is: " + otpCode);
                if (otpCode.equals("123456")) {
                    Intent goMain = new Intent(getApplicationContext(), MainActivity.class);
                    goMain.putExtra("email", bundle.getString("email"));
                    startActivity(goMain);
                    finish();
                } else {
                    Toast.makeText(OTPActivity.this,
                            "Cod gresit",
                            Toast.LENGTH_SHORT).show();
                }
                return;
            }
        });

    }

    private void setupInputs() {
        otpCode1.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().trim().isEmpty()) {
                    otpCode2.requestFocus();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        otpCode2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().trim().isEmpty()) {
                    otpCode3.requestFocus();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        otpCode3.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().trim().isEmpty()) {
                    otpCode4.requestFocus();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        otpCode4.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().trim().isEmpty()) {
                    otpCode5.requestFocus();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        otpCode5.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().trim().isEmpty()) {
                    otpCode6.requestFocus();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }
}