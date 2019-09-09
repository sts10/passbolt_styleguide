<!-- MODULE ROW // TITLE AND TEXT -->
<tr>
    <td align="center" valign="top">
        <!-- CENTERING TABLE // -->
        <!--
            The centering table keeps the content
                tables centered in the emailBody table,
                in case its width is set to 100%.
        -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" valign="top">
                    <!-- FLEXIBLE CONTAINER // -->
                    <!--
                        The flexible container has a set width
                            that gets overridden by the media query.
                            Most content tables within can then be
                            given 100% widths.
                    -->
                    <table border="0" cellpadding="0" cellspacing="0" width="480" class="flexibleContainer ">
                        <tr>
                            <td align="center" valign="top" width="480" class="flexibleContainerCell noPaddingTop">

                                <!-- CONTENT TABLE // -->
                                <!--
                                    The content table is the first element
                                        that's entirely separate from the structural
                                        framework of the email.
                                -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td valign="top" class="textContent">
                                            <?= $title; ?>
                                        </td>
                                    </tr>
                                </table>
                                <!-- // CONTENT TABLE -->

                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td valign="top" class="textContent" align="center">
                                            <?= $text; ?>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>
                    <!-- // FLEXIBLE CONTAINER -->
                </td>
            </tr>
        </table>
        <!-- // CENTERING TABLE -->
    </td>
</tr>
<!-- // MODULE ROW -->