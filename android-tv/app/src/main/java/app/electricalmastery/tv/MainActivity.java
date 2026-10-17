package app.electricalmastery.tv;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import org.json.JSONObject;

public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://electrical-installation-mastery.vercel.app";
    private static final String START = ORIGIN + "/?tv=1#home";
    private FrameLayout root;
    private WebView web;
    private View fullscreen;
    private WebChromeClient.CustomViewCallback fullscreenCallback;
    private boolean connectionDialog;

    private boolean trusted(String url) {
        Uri uri = Uri.parse(url);
        return "https".equals(uri.getScheme()) && "electrical-installation-mastery.vercel.app".equals(uri.getHost())
            && (uri.getPort() == -1 || uri.getPort() == 443);
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(11, 20, 32));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(11, 20, 32));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " ElectricalMasteryTV/1");
        if (Build.VERSION.SDK_INT >= 26) settings.setSafeBrowsingEnabled(true);
        CookieManager.getInstance().setAcceptCookie(true);
        // YouTube embeds may need their own cookies. Course sign-in stays first-party.
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                String url = request.getUrl().toString();
                if (trusted(url)) {
                    if ("/api/auth/google".equals(request.getUrl().getPath())) {
                        view.loadUrl(ORIGIN + "/tv/sign-in?tv=1"); return true;
                    }
                    return false;
                }
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && ("www.youtube.com".equals(uri.getHost()) || "youtu.be".equals(uri.getHost()))) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception ignored) { Toast.makeText(MainActivity.this, "The YouTube app is unavailable.", Toast.LENGTH_LONG).show(); }
                } else Toast.makeText(MainActivity.this, "Open this external link on your phone.", Toast.LENGTH_LONG).show();
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                CookieManager.getInstance().flush();
                if (trusted(url)) view.evaluateJavascript("if(!window.electricalTvBack){document.querySelector('button,a[href]')?.focus()}", null);
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (!request.isForMainFrame() || connectionDialog) return;
                connectionDialog = true;
                new AlertDialog.Builder(MainActivity.this).setTitle("Unable to connect")
                    .setMessage("Check the TV’s internet connection, then try again.")
                    .setPositiveButton("Try again", (dialog, which) -> web.loadUrl(START))
                    .setNegativeButton("Close", (dialog, which) -> finish())
                    .setOnDismissListener(dialog -> connectionDialog = false).show();
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onShowCustomView(View view, CustomViewCallback callback) {
                if (fullscreen != null) { callback.onCustomViewHidden(); return; }
                fullscreen = view; fullscreenCallback = callback;
                root.addView(view, new FrameLayout.LayoutParams(-1, -1)); web.setVisibility(View.GONE);
            }
            @Override public void onHideCustomView() { closeFullscreen(); }
        });
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web, "ElectricalTV", Collections.singleton(ORIGIN),
                (view, message, origin, mainFrame, reply) -> {
                    if (!mainFrame || !ORIGIN.equals(origin.toString()) || message.getData() == null) return;
                    try {
                        JSONObject data = new JSONObject(message.getData());
                        if ("playback".equals(data.optString("type"))) {
                            boolean playing = data.optBoolean("playing");
                            runOnUiThread(() -> { if (playing) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); });
                        } else if ("download".equals(data.optString("type"))) {
                            String text = data.optString("text"), name = cleanName(data.optString("name"));
                            if (text.getBytes(StandardCharsets.UTF_8).length > 2_000_000) return;
                            runOnUiThread(() -> saveWorking(name, text));
                        }
                    } catch (Exception ignored) { /* Ignore malformed messages. */ }
                });
        }
        web.setDownloadListener((url, agent, disposition, mime, length) -> {
            String name = cleanName(URLUtil.guessFileName(url, disposition, mime));
            if (url.startsWith("blob:" + ORIGIN + "/") && trusted(web.getUrl())) {
                web.evaluateJavascript("window.electricalTvDownload?.(" + JSONObject.quote(url) + "," + JSONObject.quote(name) + ")", null);
            } else if (trusted(url)) {
                try {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                    String cookies = CookieManager.getInstance().getCookie(url);
                    if (cookies != null) request.addRequestHeader("Cookie", cookies);
                    request.addRequestHeader("User-Agent", agent);
                    request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, name);
                    ((DownloadManager) getSystemService(DOWNLOAD_SERVICE)).enqueue(request);
                    Toast.makeText(this, "Downloading to Electrical Mastery’s Downloads: " + name, Toast.LENGTH_LONG).show();
                } catch (Exception ignored) { Toast.makeText(this, "Download unavailable. Try the website on your phone.", Toast.LENGTH_LONG).show(); }
            }
        });
        if (state == null || web.restoreState(state) == null) web.loadUrl(START);
        web.requestFocus();
    }

    private String cleanName(String name) {
        String safe = name.replaceAll("[^a-zA-Z0-9._-]", "_");
        if (safe.isEmpty() || safe.equals(".") || safe.equals("..")) safe = "electrical-mastery-working.txt";
        return safe.substring(0, Math.min(safe.length(), 120));
    }

    private void saveWorking(String name, String text) {
        File directory = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
        if (directory == null) directory = getFilesDir();
        try (FileOutputStream out = new FileOutputStream(new File(directory, name))) {
            out.write(text.getBytes(StandardCharsets.UTF_8));
            Toast.makeText(this, "Saved to Electrical Mastery’s Downloads: " + name, Toast.LENGTH_LONG).show();
        } catch (Exception ignored) { Toast.makeText(this, "Could not save working. Check available storage.", Toast.LENGTH_LONG).show(); }
    }

    private void closeFullscreen() {
        if (fullscreen == null) return;
        root.removeView(fullscreen); fullscreen = null; web.setVisibility(View.VISIBLE);
        if (fullscreenCallback != null) fullscreenCallback.onCustomViewHidden();
        fullscreenCallback = null; web.requestFocus();
    }

    private void media(String action) {
        if (trusted(web.getUrl())) web.evaluateJavascript("document.dispatchEvent(new CustomEvent('electrical-tv-media',{detail:" + JSONObject.quote(action) + "}))", null);
    }

    @Override public boolean onKeyDown(int key, KeyEvent event) {
        if (key == KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE || key == KeyEvent.KEYCODE_MEDIA_PLAY || key == KeyEvent.KEYCODE_MEDIA_PAUSE) {
            media(key == KeyEvent.KEYCODE_MEDIA_PLAY ? "play" : key == KeyEvent.KEYCODE_MEDIA_PAUSE ? "pause" : "toggle"); return true;
        }
        if (key == KeyEvent.KEYCODE_MEDIA_REWIND || key == KeyEvent.KEYCODE_MEDIA_FAST_FORWARD) {
            media(key == KeyEvent.KEYCODE_MEDIA_REWIND ? "rewind" : "forward"); return true;
        }
        return super.onKeyDown(key, event);
    }

    @Override public void onBackPressed() {
        if (fullscreen != null) { closeFullscreen(); return; }
        if (!trusted(web.getUrl())) { finish(); return; }
        web.evaluateJavascript("Boolean(window.electricalTvBack?.())", handled -> {
            if ("true".equals(handled)) return;
            if (web.canGoBack()) web.goBack(); else finish();
        });
    }
    @Override protected void onPause() { media("pause"); getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); web.onPause(); CookieManager.getInstance().flush(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onSaveInstanceState(Bundle state) { web.saveState(state); super.onSaveInstanceState(state); }
    @Override protected void onDestroy() { root.removeAllViews(); web.destroy(); super.onDestroy(); }
}
