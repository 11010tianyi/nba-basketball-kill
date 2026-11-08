package com.tianyi.nbabasketballkill;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Target SDK 36 draws edge-to-edge. Enable it before the WebView is
        // created so Capacitor SystemBars can pad the safe area.
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
