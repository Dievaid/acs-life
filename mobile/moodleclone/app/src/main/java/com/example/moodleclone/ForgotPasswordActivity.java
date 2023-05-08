package com.example.moodleclone;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class ForgotPasswordActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private Button forgotPassword;
    private Spinner spinner;
    private String[] resetMethods = {"Cont de e-mail personal", "Numar de telefon"};
    private EditText cnp;

    FirebaseAuth firebaseAuth;

    @Override
    public void onStart() {
        super.onStart();
        FirebaseUser currentUser = firebaseAuth.getCurrentUser();
        if (currentUser != null) {
            Intent intent = new Intent(getApplicationContext(), MainActivity.class);
            startActivity(intent);
            finish();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        firebaseAuth = FirebaseAuth.getInstance();
        forgotPassword = findViewById(R.id.forgotPassword);
        spinner = findViewById(R.id.resetMethod);
        cnp = findViewById(R.id.cnp);

        spinner.setOnItemSelectedListener(this);

        ArrayAdapter<String> arrayAdapter
                = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                resetMethods);

        arrayAdapter.setDropDownViewResource(
                android.R.layout
                        .simple_spinner_dropdown_item);

        spinner.setAdapter(arrayAdapter);

        forgotPassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String unique_cnp = cnp.getText().toString();
                if (TextUtils.isEmpty(unique_cnp)) {
                    Toast.makeText(ForgotPasswordActivity.this,
                            "Completeaza campul pentru CNP",
                            Toast.LENGTH_SHORT).show();
                    return;
                }
                if (unique_cnp.length() != 13) {
                    Toast.makeText(ForgotPasswordActivity.this,
                            "CNP invalid (lungimea nu este 13)!",
                            Toast.LENGTH_SHORT).show();
                    return;
                }
                if (unique_cnp.charAt(0) == '5' || unique_cnp.charAt(0) == '6') {
                    Log.d(TAG, "CNP OK");
                } else {
                    Toast.makeText(ForgotPasswordActivity.this,
                            "CNP invalid! (Codul trebuie sa inceapa cu 5 sau 6)",
                            Toast.LENGTH_SHORT).show();
                    return;
                }
                switch(spinner.getSelectedItem().toString()) {
                    case "Cont de e-mail personal":
                        Toast.makeText(ForgotPasswordActivity.this,
                                "Am trimis un e-mail cu pasi pentru resetarea parolei",
                                Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(ForgotPasswordActivity.this, MainActivity.class);
                        startActivity(intent);
                        break;

                    case "Numar de telefon":
                        Toast.makeText(ForgotPasswordActivity.this,
                                "Am trimis un SMS cu pasi pentru resetarea parolei",
                                Toast.LENGTH_SHORT).show();
                        intent = new Intent(ForgotPasswordActivity.this, MainActivity.class);
                        startActivity(intent);
                        break;

                    default:
                        break;

                }
            }
        });

    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }
}