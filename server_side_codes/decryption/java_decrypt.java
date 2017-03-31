import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.AmazonS3EncryptionClient;
import com.amazonaws.services.s3.model.EncryptionMaterials;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.StaticEncryptionMaterialsProvider;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.ECField;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import org.apache.commons.io.IOUtils;


public class java_decrypt {


    public java_decrypt() {

    }


    public static void main(String[] args) {
        // Prints "Hello, World" to the terminal window.
        System.out.println("Hello, World: Java");

        //read the RSA keys
        readRSAKeys();

        //
        /*
        credentialsProvider();

        //
        // callback method to call the setTransferUtility method
        //
        setTransferUtility();

        //
        new Thread(new Runnable() {
            public void run() {
                setFileToUpload();
            }
        }).start();
        */

    }

    private EncryptionMaterials encryptionMaterials;
    public void readRSAKeys(){
        try {

            // 1. Load keys from files

            //http://docs.aws.amazon.com/AmazonS3/latest/dev/encrypt-client-side-asymmetric-master-key.html

            //
            //Log.e("RSA","Reading encryption public keys...");
            byte[] bytes = IOUtils.toByteArray(getAssets().open("public.key"));
            PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(
                    new X509EncodedKeySpec(bytes));

            //
            //Log.e("RSA","Reading encryption private keys...");
            bytes = IOUtils.toByteArray(getAssets().open("private.key"));
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec ks = new PKCS8EncodedKeySpec(bytes);
            PrivateKey pk = kf.generatePrivate(ks);

            //
            //Log.e("RSA","Creating key pair...");
            KeyPair loadedKeyPair = new KeyPair(publicKey, pk);

            // 2. Construct an instance of AmazonS3EncryptionClient
            //Log.e("RSA","Done creating key pair...");
            encryptionMaterials = new EncryptionMaterials(
                    loadedKeyPair);

        }catch (Exception ex){
            Log.e("RSA","Error " + ex.toString());
        }


    }


    public void credentialsProvider(){

        // Initialize the Amazon Cognito credentials provider
        CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
                getApplicationContext(),
                "us-east-1:0eb3cb88-6fb5-42a3-ae0b-ca32990ef453",// Identity Pool ID
                Regions.US_EAST_1
        );

        setAmazonS3Client(credentialsProvider);
    }

    /**
     *  Create a AmazonS3Client constructor and pass the credentialsProvider.
     * @param credentialsProvider
     */
    public void setAmazonS3Client(CognitoCachingCredentialsProvider credentialsProvider){

        // Create an S3 client

        s3 = new AmazonS3EncryptionClient(
                credentialsProvider,
                new StaticEncryptionMaterialsProvider(encryptionMaterials));
        //s3 = new AmazonS3Client(credentialsProvider);

        // Set the region of your S3 bucket
        s3.setRegion(Region.getRegion(Regions.US_EAST_1));
    }



    /**
     * This method is used to upload the file to S3 by using TransferUtility class
     */
    public void setFileToUpload(){


        //
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat format1 = new SimpleDateFormat("yyyyMM");
        String upper_level_dir = format1.format(cal.getTime());
        format1 = new SimpleDateFormat("yyyyMMdd");
        String lower_level_dir = format1.format(cal.getTime());
        String suffix = "survey";

        //
        // TODO Auto-generated method stub
        File folder = new File("/sdcard/SensorLogger/data");
        File[] listOfFiles = folder.listFiles();
        String upload_file_name = "";

        if(listOfFiles!=null){//if sd card is not avaiable
            for (int i = 0; i < listOfFiles.length; i++) //tackled all the files
            {
                if (listOfFiles[i].isFile()) {

                    fileToUpload = listOfFiles[i];//new File(listOfFiles[i].getCanonicalPath());

                    Log.e("FileName", "v1/" + upper_level_dir + "/" + lower_level_dir + "/" + suffix + "/" + listOfFiles[i].getName());

                    if(listOfFiles[i].getName().contains("survey")) {
                        suffix = "survey";
                    }else if(listOfFiles[i].getName().contains("sensor")) {
                        suffix = "sensors";
                    }else if(listOfFiles[i].getName().contains("at")) {
                        suffix = "activetasks";
                    }else
                        continue;

                    //
                    if(appState.IMEI == null)
                        continue;

                    upload_file_name = listOfFiles[i].getName();
                    upload_file_name = upload_file_name.substring(0,upload_file_name.length()-4);
                    upload_file_name = upload_file_name + "_" + appState.IMEI + ".json";


                    //upload this file
                    ObjectMetadata objectMetadata = new ObjectMetadata();
                    objectMetadata.setSSEAlgorithm(ObjectMetadata.AES_256_SERVER_SIDE_ENCRYPTION);

                    //"Hello World, S3 Client-side Encryption Using Asymmetric Master Key!".getBytes();
                    try {
                        byte[] fileToUploadtext =  IOUtils.toByteArray(new FileInputStream(fileToUpload));

                        s3.putObject(new PutObjectRequest("sara-umich", "v1/" + upper_level_dir + "/" + lower_level_dir + "/" + suffix + "/" + upload_file_name,
                                new ByteArrayInputStream(fileToUploadtext), objectMetadata));


                        S3Object downloadedObject = s3.getObject("sara-umich", "v1/" + upper_level_dir + "/" + lower_level_dir + "/" + suffix + "/" + upload_file_name);
                        byte[] decrypted = IOUtils.toByteArray(downloadedObject.getObjectContent());
                        Log.e("RSA-decrypted ", "Is equal: " + Arrays.equals(fileToUploadtext, decrypted));

                        Log.e("RSA-decrypted ", listOfFiles[i].getName());
                        String su = new String(fileToUploadtext);
                        Log.e("RSA-decrypted ", "Prior sending: " + su);
                        String sd = new String(decrypted);
                        Log.e("RSA-decrypted ", "Post sending: " + sd);
                        //Assert.assertTrue(Arrays.equals(plaintext, decrypted));
                        //deleteBucketAndAllContents(encryptionClient);

                        fileToUpload.delete();

                        //stop if no files are left
                        /*
                        File folder1 = new File("/sdcard/SensorLogger/data");
                        File[] listOfFiles1 = folder1.listFiles();
                        if(listOfFiles1.length == 0)
                            stopSelf();
                        */



                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    /*
                    TransferObserver transferObserver = transferUtility.upload(
                            "sara-umich",     // The bucket to upload to
                            "v1/" + upper_level_dir + "/" + lower_level_dir + "/" + suffix + "/" + upload_file_name,    // The key for the uploaded object
                            fileToUpload,       // The file where the data to upload exists
                            objectMetadata
                    );

                    transferObserverListener(transferObserver,fileToUpload);
                    */
                }
            }
        }
        stopSelf();
    }

}


